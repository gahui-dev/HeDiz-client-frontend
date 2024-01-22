import React, { useState, useEffect } from 'react';
import { authAxios } from '../../api/AxiosAPI';
import { useLocation } from 'react-router-dom';

function HairstylePage() {
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const shop_seq = location.state.shop_seq;
  const style_seq = location.state.style_seq;

  useEffect(() => {
    authAxios()
      .get(`/home/hairshop/hairstyle/${shop_seq}/${style_seq}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const itemTemplate = (product) => {
    return (
      <div className='col-12'>
        <div className='flex flex-column xl:flex-row xl:align-items-start p-4 gap-4'>
          <div className='flex flex-column sm:flex-column justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <img
              className='w-9 sm:w-16rem xl:w-20rem shadow-2 block xl:block mx-auto border-round'
              src={product.style_image}
            />
            <div className='text-2xl font-bold text-900'>
              {product.style_name}
            </div>
            <div>
              <i className='pi pi-clock mr-2'></i>
              {product.style_time}
            </div>
            <div className='flex'>
              <p className='ml-2'>{product.count_review}</p>
            </div>

            <div>
              <span>{product.style_intro}</span>
            </div>
            <span>{product.style_price}원</span>
          </div>
          <div className='flex flex-column align-items-center sm:align-items-start gap-3'></div>
        </div>
      </div>
    );
  };

  return <div className='card'>{product && itemTemplate(product)}</div>;
}

export default HairstylePage;