import React from "react";
import axios from "axios";

const GetUsers = () => {
    const [users, setUsers] = React.useState([]);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        const token = JSON.parse(localStorage.getItem('user'))?.token || "";
        axios.get("http://localhost:5000/api/user/getUsers", {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then((res) => {
            setUsers(res.data);
        });
    }, []);

    return (
        <div>
            {users?.map((user) => (
                <div key={user._id}>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
};

export default GetUsers;