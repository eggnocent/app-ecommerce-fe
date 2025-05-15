import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import FormInput from '../../components/FormInput/FormInput';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { getAuthClient } from '../../api/grpc/client';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
  password: yup.string().required('Password wajib diisi').min(6, 'Password minimal 6 karakter'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
    const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const submitHandler = async (values: LoginFormValues) => {
    try {
      
      const client = getAuthClient();
      const res = await client.login({
        email: values.email,
        password: values.password,
      });

      if (res.response.base?.isError ?? true) {
        await Swal.fire({
          icon: 'error',
          title: 'Login gagal',
          text: 'Silakan coba lagi dengan yang benar',
          confirmButtonText: 'Ok',
        });
        return;
      }

      localStorage.setItem('access_token', res.response.accessToken);

      await Swal.fire({
        icon: 'success',
        title: 'Login Sukses',
        confirmButtonText: 'Ok',
      });
      navigate('/')
    } catch (e) {
      if (e instanceof RpcError) {
        if (e.code === 'UNAUTHENTICATED') {
            Swal.fire({
                icon: 'error',
                title: 'Login gagal',
                text:'email atau password anda salah!',
                confirmButtonText: 'Ok'
            })
            return
        }
      } 

      Swal.fire({
        icon: 'error',
        title: 'Login gagal',
        text:'silakan coba beberapa saat lagi',
        confirmButtonText: 'Ok'
    })
    }
  };

  return (
    <div className="login-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4">
              <h2 className="section-title text-center mb-5">Masuk</h2>
              <form onSubmit={form.handleSubmit(submitHandler)} className="login-form">
                <FormInput<LoginFormValues>
                  errors={form.formState.errors}
                  name="email"
                  register={form.register}
                  type="text"
                  placeholder="Alamat email"
                />
                <FormInput<LoginFormValues>
                  errors={form.formState.errors}
                  name="password"
                  register={form.register}
                  type="password"
                  placeholder="Kata sandi"
                />
                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Masuk
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p>
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-primary">
                      Daftar di sini
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
