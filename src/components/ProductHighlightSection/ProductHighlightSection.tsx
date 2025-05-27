import { Link } from 'react-router-dom';
import UseGrpcApi from '../../hooks/useGrpcAPI';
import { useEffect, useState } from 'react';
import { getProductClient } from '../../api/grpc/client';
import { formatToIDR } from '../../util/number';

interface ProductHighlightSectionProps {
    beforeFooter?: boolean;
}

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

function ProductHighlightSection(props: ProductHighlightSectionProps) {
    const [items, setItems] = useState<Product[]>([]);
    const productApi = UseGrpcApi();

    useEffect(() => {
        const fetchData = async () => {
            const resp = await productApi.callApi(getProductClient().highlightProducts({}))

            setItems(resp.response.data.map(d => ({
                id: d.id,
                imageUrl: d.imageUrl,
                name: d.name,
                price: d.price,
            })))
        }
        fetchData();
    }, [])
    return (
        <div className={`product-section ${props.beforeFooter ? 'before-footer-section' : ''}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                        <h2 className="mb-4 section-title">Dibuat dengan material terbaik.</h2>
                        <p className="mb-4">Rasakan perpaduan sempurna antara keahlian dan daya tahan. Furnitur kami dibuat dengan material premium untuk meningkatkan estetika dan kenyamanan ruang Anda.</p>
                        <p><Link to="/shop" className="btn">Jelajahi</Link></p>
                    </div>

                    {/* Product Items */}
                    {items.map(item => (
                        <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                        <Link className="product-item" to="/cart">
                            <img src={item.imageUrl} className="img-fluid product-thumbnail" alt="Nordic Chair" />
                            <h3 className="product-title">{item.name}</h3>
                            <strong className="product-price">{formatToIDR(item.price)}</strong>
                            <span className="icon-cross">
                                <img src="/images/cross.svg" className="img-fluid" alt="Cross" />
                            </span>
                        </Link>
                    </div>
                    ))}
        
                </div>
            </div>
        </div>
    )
}

export default ProductHighlightSection;
