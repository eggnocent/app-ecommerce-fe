import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { useEffect, useState } from 'react';
import UseGrpcApi from '../../hooks/useGrpcAPI';
import { getAuthClient } from '../../api/grpc/client';

function AdminProfile() {
    const profileApi = UseGrpcApi();
    const location = useLocation();
    const navigate = useNavigate();
    const [fullname, setFullname] = useState<string>();
    const [email, setEmail] = useState<string>();


    useEffect(() => {
        if (location.pathname === '/admin/profile') {
            navigate('/admin/profile/change-password');
        }
    }, [navigate, location.pathname]);

    useEffect(() => {
            const fetchProfile = async () => {
            const resp = await profileApi.callApi(getAuthClient().getProfile({}))
                setFullname(resp.response.fullName);
                setEmail(resp.response.email);
            }
            
            fetchProfile();
        }, []);

    return (
        <>
            <PlainHeroSection title='Profil Saya' />

            <div className="untree_co-section before-footer-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-12">
                            <div className="p-4 p-lg-5 border bg-white">
                                <div className="row">
                                <div className="form-group">
                                            <label className="text-black">Nama Lengkap</label>
                                            <div className="form-control-plaintext">{fullname}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="text-black">Alamat Email</label>
                                            <div className="form-control-plaintext">{email}</div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="nav flex-column nav-pills">
                                <Link
                                    to="/admin/profile/change-password"
                                    className={`nav-link ${location.pathname === '/admin/profile/change-password' ? 'active' : ''}`}
                                >
                                    Ubah Kata Sandi
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminProfile;