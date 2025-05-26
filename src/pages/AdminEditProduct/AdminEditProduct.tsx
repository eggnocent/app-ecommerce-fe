import Swal from 'sweetalert2';
import { getProductClient } from '../../api/grpc/client';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection'
import ProductForm from '../../components/ProductForm/ProductForm'
import UseGrpcApi from '../../hooks/useGrpcAPI';
import { type ProductFormValues } from '../../types/product';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface uploadImageResponse {
    file_name: string;
    message: string;
    success: boolean;
}

function AdminEditProduct() {
    const { id } = useParams();
    const detailApi  =  UseGrpcApi();
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const editProductApi = UseGrpcApi();
    const [defaultValues, setDefalultValues] = useState<ProductFormValues | undefined>(undefined);

    useEffect(() => {
        const fetchDetail = async () => {
            const resp = await detailApi.callApi(getProductClient().detailProduct({
                id: id ?? ""
            }));

            setDefalultValues({
                name: resp.response.name,
                price: resp.response.price,
                description: resp.response.description,
                image: new DataTransfer().files,
                imageUrl: resp.response.imageUrl,
            });
        }

        fetchDetail();
    }, [])



    const submitHandler = async (values: ProductFormValues) => {
        console.log(values)
        try {

        setUploadLoading(true);
        let newImageFileName = "";

        if(values.image.length > 0) {
        const formData = new FormData();
        formData.append("image", values.image[0]);

        const uploadResponse = await axios.post<uploadImageResponse>("http://localhost:3000/product/upload", formData)
        if (uploadResponse.status !== 200) {
            Swal.fire({
                title: "upload gambar gagal",
                text: "silakan coba beberapa saat lagi",
                icon: "error"
            })
            return
        }

        newImageFileName = uploadResponse.data.file_name;
        }   
        

        await editProductApi.callApi( getProductClient().editProduct({
            id: id ?? "",
            description: values.description ?? "",
            imageFileName: (newImageFileName || values.imageUrl?.split("/").pop() || "").replace(/^\/+/, ""),
            name: values.name,
            price: values.price
        }));

        Swal.fire({
            title: "edit produk sukses",
            icon: "success"
        })

        navigate("/admin/products");
        } finally {
            setUploadLoading(false)
        }
    }
    return (
        <>
            <PlainHeroSection title='Edit Produk' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <ProductForm
                             onSubmit={submitHandler} 
                             disabled={editProductApi.isLoading || uploadLoading || detailApi.isLoading}
                             defaultValues={defaultValues}
                             isEdit
                              />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminEditProduct;
