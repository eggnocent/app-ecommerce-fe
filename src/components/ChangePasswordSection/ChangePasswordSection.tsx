import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client";
import Swal from "sweetalert2";
import { useState } from "react";
import { RpcError } from "@protobuf-ts/runtime-rpc";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const changePasswordSchema = yup.object().shape ({
    current_password: yup.string().required('kata sandi saat ini wajib diisi'),
    new_password: yup.string().required('kata sandi baru wajib diisi').min(6, 'kata sandi baru minimal 6 karakter'),
    confirm_new_password: yup.string().required('kata sandi baru wajib diisi').oneOf([yup.ref('new_password')], 'konfirmasi kata sandi baru harus sesuai'),
})

interface ChangePasswordFormValues {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}

function ChangePasswordSection() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const logoutUser = useAuthStore(state => state.logout)
    const form = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema)
    }); 

    const submitHandler = async (values: ChangePasswordFormValues) => { 

        try {
            setIsLoading(true)
            const resp = await getAuthClient().changePassword({
                newPassword: values.new_password,
                newPasswordConfirmation: values.confirm_new_password,
                oldPassword: values.current_password,
            });
    
            if (resp.response.base?.isError ?? true) {
                if (resp.response.base?.message === 'old password not match') {
                    Swal.fire ({
                        icon: 'error',
                        title: 'pergantian password gagal',
                        text: 'kata sandi lama salah'
                    })
                    return
                }
                Swal.fire ({
                    icon: 'error',
                    title: 'terjadi kesalahan',
                    text: 'silakan coba beberapa saat lagi'
                })
                return
            }
    
            Swal.fire({
                icon: 'success',
                title: 'pergantian password sukses',
            })
            form.reset();
            return
        } catch (e) {
             if (e instanceof RpcError) {
                            if (e.code == 'UNAUTHENTICATED') {
                                logoutUser();
                                localStorage.removeItem('access_token');
                                Swal.fire({
                                    title: 'sesi telah berakhir',
                                    text: 'silakan login kembali',
                                    icon:'warning'
                                })
                                navigate('/');
                                return
                            }
                        }
            
                        Swal.fire({
                            title: 'terjadi kesalahan',
                            text: 'silakan coba beberapa saat lagi',
                            icon:'warning'
                        })
        } finally {
            setIsLoading(false)
        }
        
    };

    return (
        <div className="p-4 p-lg-5 border bg-white">
            <h2 className="h3 mb-3 text-black">Ubah Kata Sandi</h2>
            <form onSubmit={form.handleSubmit(submitHandler)}>
                <FormInput<ChangePasswordFormValues>
                    errors={form.formState.errors}
                    name="current_password"
                    register={form.register}
                    type="password"
                    label="Kata sandi saat ini"
                    disabled= {isLoading}
                    placeholder="ketikan kata sandi anda yang lama"
                />
                <FormInput<ChangePasswordFormValues>
                    errors={form.formState.errors}
                    name="new_password"
                    register={form.register}
                    type="password"
                    label="Kata sandi baru"
                    disabled= {isLoading}
                    placeholder="ketikkan kata sandi anda yang baru"
                />
                <FormInput<ChangePasswordFormValues>
                    errors={form.formState.errors}
                    name="confirm_new_password"
                    register={form.register}
                    type="password"
                    label="Konfirmasi kata sandi baru"
                    disabled= {isLoading}
                    placeholder="konfirmasi kata sandi baru yang diubah"
                />
                <button type="submit" className="btn btn-primary" disabled= {isLoading}>Perbarui Kata Sandi</button>
            </form>
        </div>
    );
}

export default ChangePasswordSection;
