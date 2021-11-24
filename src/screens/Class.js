import { IconButton , Button} from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db } from "../firebase";
import "./Class.css";

function Class() {
  const [classData, setClassData] = useState({});
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const { id } = useParams();
  const history = useHistory();

  /*
    PLAN: Create a snapshot listener and fill in the data into classData, 
    and then map through it during render
  */

  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);

  const createPost = async () => {
    try {
      const myClassRef = await db.collection("classes").doc(id).get();
      const myClassData = await myClassRef.data();
      
      let tempPosts = myClassData.posts;
      tempPosts.push({
        authorId: user.uid,
        content: announcementContent,
        date: moment().format("MMM Do YY  h:mm:ss"),
        image: user.photoURL,
        name: user.displayName,
        isReported:false
      });
      myClassRef.ref.update({
        posts: tempPosts,
      });
      setAnnouncementContent("");
    } catch (error) {
      console.error(error);
      alert(`There was an error posting the announcement, please try again!`);
    }
  };

  useEffect(() => {
    db.collection("classes")
      .doc(id)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!data) history.replace("/");
        console.log(data);
        setClassData(data);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) history.replace("/");
  }, [loading, user]);

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">{classData?.name}</div>
        <p>Created By: {classData.creatorName}</p>
      </div>
      <div className="class__nav">
      <Button onClick={e=> {e.preventDefault() ; history.push("/class/"+id)}}>Lectures</Button>
        <Button onClick={e=> {e.preventDefault() ; history.push("/class/"+id+"/discussion")}}>Discussion</Button>
        <Button onClick={e=> {e.preventDefault() ; history.push("/class/"+id+"/assignments")}}>Assignments</Button>
        
        </div>
      <div className="class__announce">
        <img src={user?.photoURL} alt="My image" />
        <input
          type="text"
          value={announcementContent}
          onChange={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Share something with your class. Spark a discussion!"
        />
        <IconButton onClick={createPost}>
          <SendOutlined />
        </IconButton>
      </div>
      {posts?.map((post,idx) => (
        <Announcement
          authorId={post.authorId}
          content={post.content}
          date={post.date}
          image={post.image}
          name={post.name}
          classId={id}
          index={idx}
          // isReported={post.isReported}
        />
      ))}
    </div>
  );
}

export default Class;
