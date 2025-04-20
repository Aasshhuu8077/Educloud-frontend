// import React, { useEffect, useState } from 'react'
// import "./coursedescription.css"
// import { useNavigate, useParams } from 'react-router-dom'
// import { CourseData } from '../../context/CourseContext';
// import { server } from '../../main';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { UserData } from '../../context/UserContext';
// import Loading from '../../components/loading/Loading';

// const Coursedescription = ({user}) => {
//     const params = useParams();
//     const navigate = useNavigate();
//     const [loading , setloading] = useState(false);
//     const {fetchUser} = UserData();
//     const {fetchCourse , course , fetchCourses} = CourseData();

//     useEffect(()=>{
//         fetchCourse(params.id);
//     })

//     const checkouthandler = async ()=>{
//         const token = localStorage.getItem("token")
//         setloading(true);
//         const{data:{order}} =  await axios.post(`${server}/api/course/checkout/${params.id}` , {},{
//             headers:{
//                 token,
//             },
//         });
//         const options = {
//             key: "rzp_test_yOMeMyaj2wlvTt",
//             amount: order.id,
//             currency: "INR",
//     name: "EDU-CLOUD", //your business name
//     description: "Learn With Educloud",
//     image: "https://example.com/your_logo",
//     order_id: order.id,

//     handler:async function(response){
//         const{razorpay_order_id, razorpay_payment_id, razorpay_signature} = 
//         response;
//         try{
//             const {data} = await axios.post(`${server}/api/verification/${params.id}` ,{
//                 razorpay_order_id, razorpay_payment_id, razorpay_signature
//             },{
//                 headers:{
//                     token,
//                 },
//             })

//             await fetchUser();
//             await fetchCourses();
//             toast.success(data.message);
//             setloading(false);
//             navigate(`/payment-success/${razorpay_payment_id}`)
            
//         }
//         catch(error){
//             toast.error(error.response.data.message)
//             setloading(false)
//         }

//     },
//     theme:{
//         color:"#8a4baf"
//     },
//         };
//         const rzp = new window.Razorpay(options);

//         rzp.open();
//     }; 

//   return (
//    <>
//    {
//     loading  ? <Loading/> : 
//     (
//         <>
//         {course && (<div className='course-description'>
//             <div className="course-header">
//                 <img src={`${server}/${course.image}`} 
//                 className='course-image'
//                 alt="" />
//                 <div className="course-info">
//                     <h2>{course.title}</h2>
//                     <p>Instructor:{course.createdBy}</p>
//                     <p>Duration: {course.duration} weeks</p>
//                     <div>
//                         <p>Let's get started with course At ₹{course.price} </p>
//                         {
//                             user && user.subscription.includes(course._id) ? (
//                                 <button onClick={()=> navigate(`/course/study/${course._id}`)}>Study</button>
//                             ):(
//                                <button onClick={checkouthandler} className='common-btn'>Buy Now</button>
//                             )
//                         }
//                     </div>
    
//                 </div>
//             </div>
//         </div> )}
//         </>
//     )
//    }
//    </>
//   )
// }

// export default Coursedescription



import React, { useEffect, useState } from 'react'
import "./coursedescription.css"
import { useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../context/CourseContext';
import { server } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserData } from '../../context/UserContext';
import Loading from '../../components/loading/Loading';

const Coursedescription = ({ user }) => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { fetchUser } = UserData();
    const { fetchCourse, course, fetchCourses , fetchMycourse } = CourseData();
    console.log("Course data:", course); // Debugging

    useEffect(() => {
        fetchCourse(params.id);
    }, [params.id]);  // Added dependency array

    const checkouthandler = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
           
        if (!token) {
            toast.error("Authentication failed! Please log in again.");
            setLoading(false);
            return;
        }
        try {
            const { data: { order } } = await axios.post(
                `${server}/api/course/checkout/${params.id}`, 
                {},
                {
                    headers: { token },
                }
            );

            const options = {
                key: "rzp_test_5a8w8amerefgtu",
                amount: order.price,  // Correct amount usage
                currency: "INR",
                name: "EDU-CLOUD",
                description: "Learn With Educloud",
                image: "https://example.com/your_logo",
                order_id: order.id,

                handler: async function(response) {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

                    try {
                        const { data } = await axios.post(
                            `${server}/api/verification/${params.id}`, 
                            {
                                razorpay_order_id,
                                razorpay_payment_id,
                                razorpay_signature
                            },
                            {
                                headers: { token }
                            }
                        );

                        await fetchUser();
                        await fetchCourses();
                        await fetchMycourse();
                        toast.success(data.message);
                        setLoading(false);
                        navigate(`/payment-success/${razorpay_payment_id}`);
                    } catch (error) {
                        console.error("Payment Verification Error:", error.response || error);
    toast.error(error.response?.data?.message || "Something went wrong! Try again.");
    setLoading(false);
                    }
                },
                theme: {
                    color: "#8a4baf"
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();  // Correct instance usage

        } catch (error) {
            toast.error(error.response?.data?.message || "Checkout failed");
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? <Loading /> : (
                <>
                    {course && (
                        <div className='course-description'>
                            <div className="course-header">
                                <img src={`${server}/${course.image}`} 
                                    className='course-image'
                                    alt={course.title} />
                                <div className="course-info">
                                    <h2>{course.title}</h2>
                                    <p>Instructor: {course.createdBy}</p>
                                    <p>Duration: {course.duration} weeks</p>
                                    <div>
                                        <p>Let's get started with course At ₹{course.price} </p>
                                        {user && user.subscription.includes(course._id) ? (
                                            <button onClick={() => navigate(`/course/study/${course._id}`)}>Study</button>
                                        ) : (
                                            <button onClick={checkouthandler} className='common-btn'>Buy Now</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Coursedescription;
