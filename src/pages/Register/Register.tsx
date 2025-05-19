import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAuthClient } from '../../api/grpc/client';
import Swal from 'sweetalert2';
import UseGrpcApi from '../../hooks/useGrpcAPI';

const registerSchema = yup.object().shape({
    full_name: yup.string().required('nama lengkap wajib diisi'),
    email: yup.string().email('email tidak valid').required('email wajib diisi'),
    password: yup.string().required('kata sandi wajib diisi').min(6, "minimal kata sandi adalah 6 karakter"),
    password_confirmation: yup.string().required('konfirmasi kata sandi wajib diisi').oneOf([yup.ref('password')], "Konfirmasi kata sandi tidak sesuai"),
})

interface RegisterFormValues {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

const Register = () => {
    const registerApi = UseGrpcApi();
    const navigate = useNavigate()
    const form = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema)
    }); 

    const submitHandler = async (values: RegisterFormValues) => {
        await registerApi.callApi(getAuthClient().register({
            email: values.email,
            fullName: values.full_name,
            password: values.password,
            passwordConfirmation: values.password_confirmation
        }), {
            useDefaultError: false,
            defaultError(resp) {
                if (resp.response.base?.message === 'user already exist') {
                    Swal.fire({
                        title: 'registrasi gagal',
                        text: 'email yang anda masukan sudah terpakai',
                        icon: 'error',
                    })
                }
            }
        })

        Swal.fire({
            title: 'Regsitrasi berhasil',
            text: 'silakan masuk dengan akun baru anda',
            icon: 'success'
        })
        navigate('/login')

    
    }
    return (
        <div className="login-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="login-wrap p-4">
                            <h2 className="section-title text-center mb-5">Daftar</h2>
                            <form onSubmit={form.handleSubmit(submitHandler)} className="login-form">
                                <FormInput<RegisterFormValues>
                                    errors={form.formState.errors}
                                    name='full_name'
                                    register={form.register}
                                    type='text'
                                    placeholder='Nama Lengkap'
                                    disabled={registerApi.isLoading}
                                />
                                <FormInput<RegisterFormValues>
                                    errors={form.formState.errors}
                                    name='email'
                                    register={form.register}
                                    type='text'
                                    placeholder='Alamat email'
                                    disabled={registerApi.isLoading}
                                />
                                <FormInput<RegisterFormValues>
                                    errors={form.formState.errors}
                                    name='password'
                                    register={form.register}
                                    type='password'
                                    placeholder='Kata sandi'
                                    disabled={registerApi.isLoading}
                                />
                                <FormInput<RegisterFormValues>
                                    errors={form.formState.errors}
                                    name='password_confirmation'
                                    register={form.register}
                                    type='password'
                                    placeholder='Konfirmasi kata sandi'
                                    disabled={registerApi.isLoading}
                                />
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary btn-block"  disabled={registerApi.isLoading}>Buat Akun</button>
                                </div>
                                <div className="text-center mt-4">
                                    <p>Sudah punya akun? <Link to="/login" className="text-primary">Masuk di sini</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
