import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export { Admin };

function Admin() {
    const auth = useSelector(x => x.auth.value.user);
    return (
        <div>
            <h1>Hi {auth?.firstName}!</h1>
            <p>Welcome Admin</p>
            <p><Link to="/users">Manage Users</Link></p>
        </div>
    );
}
