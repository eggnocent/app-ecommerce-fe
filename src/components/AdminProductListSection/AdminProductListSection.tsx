import React, { useEffect, useState } from 'react'
import useSortableHeader from '../../hooks/useSortableHeader';
import SortableHeader from '../SortableHeader/SortableHeader';
import Pagination from '../Pagination/Pagination';
import { Link } from 'react-router-dom';
import UseGrpcApi from '../../hooks/useGrpcAPI';
import { getProductClient } from '../../api/grpc/client';
import { formatToIDR } from '../../util/number';
import Swal from 'sweetalert2';
 
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

function AdminProductListSection() {
    const deleteAPI = UseGrpcApi()
    const listApi = UseGrpcApi();
    const { handleSort, sortConfig } = useSortableHeader();
    const [items, setItems] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [refreshFlag, setRefreshFlag] = useState<boolean>(true)
    

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const deleteHandler = async (id: string) => {
        const result = await Swal.fire({
            title: 'Ingin hapus produk ini?',
            text: 'produk yang telah dihapus tidak dapat dikembalikan',
            confirmButtonAriaLabel: 'ya',
            showCancelButton: true,
            cancelButtonText: 'batal',
            icon: 'info'
        });

        if (result.isConfirmed) {
            await deleteAPI.callApi(getProductClient().deleteProduct({
                id: id
            }));
            Swal.fire({
                title: 'produk telah berhasil dihapus',
                icon: 'success'
            });
            setRefreshFlag(value =>  !value)
        }

        

    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await listApi.callApi(getProductClient().listProductAdmin({
                pagination: {
                    currentPage: currentPage,
                    itemPerPage: 2,
                    sort: sortConfig.direction ? {
                        direction: sortConfig.direction,
                        field: sortConfig.key,
                    } : undefined
                }
            }));
    
            const products = res.response.data.map((d): Product => ({
                id: d.id,
                name: d.name,
                description: d.description,
                price: d.price,
                imageUrl: d.imageUrl
            }));
            setTotalPages(res.response.pagination?.totalPageCount ?? 0);
    
            setItems(products);
        };
    
        fetchData();
    }, [currentPage, sortConfig.direction, sortConfig.key, refreshFlag]);
    

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">Produk</h2>
                <Link to="/admin/products/create">
                    <button className="btn btn-primary">Tambah Produk</button>
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table site-blocks-table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <SortableHeader
                                label="Nama Produk"
                                sortKey="name"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Harga"
                                sortKey="price"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Deskripsi"
                                sortKey="description"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(i => (
                            <tr key={i.id}>
                            <td>
                                <img src = {i.imageUrl}width="50" alt="Produk" />
                            </td>
                            <td>{i.name}</td>
                            <td>{formatToIDR(i.price)}</td>
                            <td>{i.description}</td>
                            <td>
                                <button className="btn btn-secondary me-2">Edit</button>
                                <button className="btn" onClick={() => deleteHandler(i.id)}>Hapus</button>
                            </td>
                        </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

        </div>
    );
}

export default AdminProductListSection;
