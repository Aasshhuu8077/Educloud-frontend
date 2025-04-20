// import React, { useEffect, useState } from 'react';
// import './lecture.css';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { server } from '../../main';
// import Loading from '../../components/loading/Loading';
// import { UserData } from '../../context/UserContext';

// const Lecture = () => {
//     const [lectures, setLectures] = useState([]);
//     const [lecture, setLecture] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [lecloading, setLecLoading] = useState(false);
//     const [show, setShow] = useState(false);
//     const params = useParams();
//     const { user } = UserData(); // Get user data from context

//     async function fetchLectures() {
//         try {
//             const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {

//                 headers: {
//                     token: localStorage.getItem("token")
//                 },

//             });
//             console.log("Lectures fetched:", data);

//             setLectures(data.lectures);
//             setLoading(false);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function fetchLecture(id) {
//         setLecLoading(true);
//         try {
//             const { data } = await axios.get(`${server}/api/lecture/${id}`, {
//                 headers: {
//                     token: localStorage.getItem("token")
//                 }
//             });
//             setLecture(data.lecture);
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLecLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchLecture();
//         fetchLectures();
//     }, []);

//     return (
//         <>
//             {loading ? <Loading /> : (
//                 <div className="lecture-page">
//                     <div className="left">
//                         {lecloading ? <Loading /> : (
//                             lecture ? (
//                                 <>
//                                     <video
//                                         src={`${server}/${lecture.video}`}
//                                         width="100%"
//                                         controls
//                                         controlsList="nodownload noremoteplayback"
//                                         disablePictureInPicture
//                                         disableRemotePlayback
//                                         autoPlay
//                                     ></video>
//                                     <h1>{lecture.title}</h1>
//                                     <h3>{lecture.description}</h3>
//                                 </>
//                             ) : (
//                                 <h1>Please select a lecture</h1>
//                             )
//                         )}
//                     </div>
//                     <div className="right">
//                         {user && user.role === "admin" && (
//                             <button className="common-btn" onClick={() => setShow(!show)}>Add Lecture +</button>
//                         )}
//                         {show && (
//                             <div className="lecture-form">
//                                 <h2>Add Lecture</h2>
//                                 <form>
//                                     <label htmlFor="title">Title</label>
//                                     <input type="text" id="title" required />
//                                     <label htmlFor="description">Description</label>
//                                     <input type="text" id="description" required />
//                                     <input type="file" placeholder="Choose video" required />
//                                     <button type="submit" className="common-btn">Add</button>
//                                 </form>
//                             </div>
//                         )}
//                         {lectures.length > 0 ? (
//                             lectures.map((e, i) => (
//                                 <>
//                                 <div key={i} onClick={() => fetchLecture(e._id)} 
//                                    className={`lecture-number ${lecture._id === e._id && "active"}`}


//                                    >
//                                     {i + 1}. {e.title}
//                                 </div>
//                                 {
//                                     user && user.role==="admin" && admin && <button className='comman-btn'  style={{background:"red"}}>
//                                         Delete{e.title}
//                                     </button>
//                                 }
//                                 </>
//                             ))
//                         ) : (
//                             <p>No lectures yet!</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Lecture;

import React, { useEffect, useState } from 'react';
import './lecture.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../main';
import Loading from '../../components/loading/Loading';
import { UserData } from '../../context/UserContext';
import toast from 'react-hot-toast';

const Lecture = () => {
    const [lectures, setLectures] = useState([]);
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lecloading, setLecLoading] = useState(false);
    const [show, setShow] = useState(false);
    const params = useParams();
    const navigate = useNavigate()
    const { user } = UserData(); // Get user data from context
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState("");
    const [videoPrev, setVideoPrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);


    if (user && user.role !== "admin" && !user.subscription.includes(params.id))
        return navigate('/')

    // Fetch all lectures for the course
    async function fetchLectures() {
        try {
            const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            console.log("Lectures fetched:", data);

            setLectures(data.lectures);
            if (data.lectures.length > 0) {
                setLecture(data.lectures[0]); // Select the first lecture by default
            }
        } catch (error) {
            console.error("Error fetching lectures:", error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch a specific lecture
    async function fetchLecture(id) {
        setLecLoading(true);
        try {
            const { data } = await axios.get(`${server}/api/lecture/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setLecture(data.lecture);
        } catch (error) {
            console.error("Error fetching lecture:", error);
        } finally {
            setLecLoading(false);
        }
    }

    const changeVideoHandler = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setVideoPrev(reader.result);
            setVideo(file);

        }
    }

    const submitHandler = async (e) => {
        setBtnLoading(true);
        e.preventDefault();
        const myForm = new FormData();
        myForm.append("title", title);
        myForm.append("description", description);
        myForm.append("file", video);
        try {
            const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm,
                {
                    headers: {
                        token: localStorage.getItem("token")

                    }
                }
            )
            toast.success(data.messgae);
            setBtnLoading(false);
            setShow(false);
            fetchLectures();
            setTitle("");
            setDescription("");
            setVideoPrev("");
            setVideo("");

        }
        catch (error) {
            toast.error(error.response.data.message)
            setBtnLoading(false);
        }

    }

    const deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this lecture?")) {
            try {
                const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                })
                toast.success(data.message);
                fetchLectures();
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    }

    // Fetch lectures on mount
    useEffect(() => {
        fetchLectures();
    }, []); // Only runs once when the component mounts

    return (
        <>
            {loading ? <Loading /> : (
                <div className="lecture-page">
                    <div className="left">
                        {lecloading ? <Loading /> : (
                            lecture ? (
                                <>
                                    <video
                                        src={`${server}/${lecture.video}`}
                                        width="100%"
                                        controls
                                        controlsList="nodownload noremoteplayback"
                                        disablePictureInPicture
                                        disableRemotePlayback
                                        autoPlay
                                    ></video>
                                    <h1>{lecture.title}</h1>
                                    <h3>{lecture.description}</h3>
                                </>
                            ) : (
                                <h1>Please select a lecture</h1>
                            )
                        )}
                    </div>
                    <div className="right">
                        {/* Admin: Add Lecture Button */}
                        {user && user.role === "admin" && (
                            <button className="common-btn" onClick={() => setShow(!show)}>Add Lecture +</button>
                        )}

                        {/* Add Lecture Form */}
                        {show && (
                            <div className="lecture-form">
                                <h2>Add Lecture</h2>
                                <form onSubmit={submitHandler}>
                                    <label htmlFor="title">Title</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} id="title" required />
                                    <label htmlFor="description">Description</label>
                                    <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" id="description" required />
                                    <input type="file" placeholder="Choose video" onChange={changeVideoHandler} required />
                                    {
                                        videoPrev && <video src={videoPrev} alt="" width={300} controls></video>
                                    }
                                    <button disabled={btnLoading} type="submit" className="common-btn">
                                        {btnLoading ? "Please Wait..." : "Add"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Lecture List */}
                        {lectures.length > 0 ? (
                            lectures.map((e, i) => (
                                <div key={e._id}>
                                    <div
                                        onClick={() => fetchLecture(e._id)}
                                        className={`lecture-number ${lecture && lecture._id === e._id ? "active" : ""}`}
                                    >
                                        {i + 1}. {e.title}
                                    </div>

                                    {/* Admin: Delete Lecture Button */}
                                    {user && user.role === "admin" && (
                                        <button className='common-btn' onClick={() => deleteHandler(e._id)} style={{ background: "red" }}>
                                            Delete {e.title}
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No lectures yet!</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Lecture;
