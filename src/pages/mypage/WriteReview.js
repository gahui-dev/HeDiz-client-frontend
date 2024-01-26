import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Rating } from 'primereact/rating';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { authAxios } from '../../api/AxiosAPI';
import { Panel } from 'primereact/panel';

function WriteReview() {
  const [value, setValue] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [sendImgs, setSendImgs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const reserv_seq = location.state.reserv_seq;
  const shop_seq = location.state.shop_seq;
  const shop_name = location.state.shop_name;
  console.log(reserv_seq, shop_seq, shop_name);
  console.log(value);

  function todayTime() {
    let date = new Date();
    console.log(date);
    let year = date.getFullYear(); //년도 구하기
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;
    return (
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    );
  }
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    let reader = new FileReader();
    reader.onload = () => {
      setSendImgs(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    const requestData = {
      cust_seq: localStorage.getItem('cust_seq'),
      shop_seq: shop_seq,
      reserv_seq: reserv_seq,
      review_score: value,
      review_content: data.review_content,
      review_photo: sendImgs,
      review_date: todayTime(),
      review_reply: null,
    };

    console.log('Request Data:', requestData);

    authAxios()
      .post(`/mypage/review`, requestData)
      .then((response) => {
        console.log('Response Data:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    navigate('/mypage');
  };

  return (
    <>
      <Panel header='리뷰 등록'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-column flex-wrap gap-4'
        >
          <div className='card flex'>
            <Rating
              value={value}
              onChange={(e) => setValue(e.value)}
              cancel={false}
            />
          </div>
          <img src={`${sendImgs}`}></img>
          <div>
            <input
              type='file'
              style={{ display: 'none' }}
              id='review_photo'
              name='review_photo'
              accept='image/*'
              onChange={handleImageUpload}
            />
            <label
              className='btn btn-secondary border-0 bg_grey'
              htmlFor='review_photo'
            >
              사진 추가
            </label>
          </div>
          <div>
            <InputTextarea
              className='w-12 '
              placeholder='리뷰 내용을 입력해주세요'
              {...register('review_content')}
            />
          </div>
          <Button
            label='리뷰 등록'
            type='submit'
            className='w-5'
          />
        </form>
      </Panel>
    </>
  );
}

export default WriteReview;
