import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuthClient } from "../../api/grpc/client";
import Swal from "sweetalert2";
import UseGrpcApi from "../../hooks/useGrpcAPI";

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
    const submitApi = UseGrpcApi();
    const form = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema)
    }); 

    const submitHandler = async (values: ChangePasswordFormValues) => { 
    await submitApi.callApi(getAuthClient().changePassword({
        newPassword: values.new_password,
        newPasswordConfirmation: values.confirm_new_password,
        oldPassword: values.current_password,
    }), {
        defaultError: (resp) => {
            if (resp.response.base?.message === 'old password not match') {
                Swal.fire ({
                    icon: 'error',
                    title: 'pergantian password gagal',
                    text: 'kata sandi lama salah'
                })
            }
        },

        useDefaultError: false
    });

        Swal.fire({
            icon: 'success',
            title: 'pergantian password sukses',
        })
        form.reset();
        
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
                    disabled= {submitApi.isLoading}
                    placeholder="ketikan kata sandi anda yang lama"
                />
                <FormInput<ChangePasswordFormValues>
                    errors={form.formState.errors}
                    name="new_password"
                    register={form.register}
                    type="password"
                    label="Kata sandi baru"
                    disabled= {submitApi.isLoading}
                    placeholder="ketikkan kata sandi anda yang baru"
                />
                <FormInput<ChangePasswordFormValues>
                    errors={form.formState.errors}
                    name="confirm_new_password"
                    register={form.register}
                    type="password"
                    label="Konfirmasi kata sandi baru"
                    disabled= {submitApi.isLoading}
                    placeholder="konfirmasi kata sandi baru yang diubah"
                />
                <button type="submit" className="btn btn-primary" disabled= {submitApi.isLoading}>Perbarui Kata Sandi</button>
            </form>
        </div>
    );
}

export default ChangePasswordSection;
