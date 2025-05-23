import { useForm } from "react-hook-form";
import FormInput from "../FormInput/FormInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyInput from "../Currency Input/CurrencyInput";


const createProductSchema = yup.object().shape({
    name: yup.string().required("nama produk wajib diisi"),
    price: yup.number().required("harga produk wajib diisi").typeError("harga produk tidak valid").moreThan(0, "harga produk harus lebih dari 0"),
    description: yup.string(),
    image: yup.mixed<FileList>().required("gambar produk wajib diisi")
    .test("fileLength", "gambar produk wajib diisi", (FileList) => {
        return FileList.length > 0
    })
    .test("fileType", "format gambar tidak sesuai/valid", (FileList) => {
        return FileList && FileList.length > 0 ? ["image/jpeg", "image/png"].includes(FileList[0].type) : true
    })
})


interface ProductFormValues{
    name: string;
    price: number;
    description?: string;
    image: FileList;
}

function ProductForm() {
    const form = useForm<ProductFormValues>({
        resolver: yupResolver(createProductSchema),
    });
    const submitHandler = (values: ProductFormValues) => {
        console.log(values)
    }
    
    return (
        <div className="p-4 p-lg-5 border bg-white">

            <form onSubmit={form.handleSubmit(submitHandler)}>
                <FormInput  <ProductFormValues>
                    errors={form.formState.errors}
                    name="name"
                    register={form.register}
                    type="text"
                    label="Nama produk"
                    placeholder="nama produk"
                    labelRequired
                
                />

                <CurrencyInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="price"
                    control={form.control}
                    label="Harga"
                    placeholder="harga produk"
                    labelRequired
                />

            <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="image"
                    register={form.register}
                    type="image"
                    label="gambar product"
                    placeholder="gambar product"
                    labelRequired
                />

            <FormInput<ProductFormValues>
                    errors={form.formState.errors}
                    name="description"
                    register={form.register}
                    type="textarea"
                    label="deskripsi"
                    placeholder="deskripsi product..."
                />

            <div className="form-group">
                <button className="btn btn-primary" type="submit">Simpan Produk</button>
            </div>

            </form>
            
        </div>
    )
}

export default ProductForm;
