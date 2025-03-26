import { Header, ProtectedRoute } from '../components';

function Layout() {

    return (
        <>
            <Header />
            <ProtectedRoute />
        </>
    );
}

export default Layout;