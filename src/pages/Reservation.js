import React, { useState, useEffect } from 'react';
import { authAxios } from 'api/AxiosAPI';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

function Reservation() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    authAxios()
      .get(`mypage/realtime-reservation/${localStorage.getItem('cust_seq')}`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setReservations(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  ///// 예약 취소를 누를 경우 발생하는 핸들러
  ///// 예약 seq 와 영수증 id를 받아와서 예약 상태를 2로 변경하고 결제를 취소
  const handleReservCancel = (reserv_seq, receipt_id) => {
    console.log(receipt_id);
    authAxios()
      .put(`mypage/realtime-reservation/${reserv_seq}`, { receipt_id })
      .then((response) => {
        console.log('Auth Response:', response.data);
        // BootpayCancelAPI(reserv_receipt);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };

  ///// 목록 생성 템플릿
  const itemTemplate = (reservation, index) => {
    return (
      <div
        className='col-12'
        key={reservation.style_seq}
      >
        <div
          className={classNames(
            'flex flex-column xl:flex-row xl:align-items-start p-4 gap-4',
            {
              'border-top-1 surface-border': index !== 0,
            }
          )}
        >
          <div className='flex flex-row align-items-center'>
            <div className='flex flex-column ml-4'>
              <div className='text-2xl font-bold text-900'>
                {reservation.shop_name}
              </div>
              <span className='flex align-items-center gap-2'>
                <div className='flex flex-column'>
                  <span className='font-semibold'>
                    예약한 스타일 : {reservation.style_name}
                  </span>
                  <span>담당 디자이너 : {reservation.staff_nickname}</span>
                  <span>예약 날짜 : {reservation.reserv_date}</span>
                  <span>예약 시간 : {reservation.reserv_time}</span>
                </div>
                <Button
                  onClick={() =>
                    handleReservCancel(
                      reservation.reserv_seq,
                      reservation.receipt_id
                    )
                  }
                >
                  예약 취소
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return `현재 예약중인 가게가 없어요 :)`;

    let list = items.map((reservation, index) => {
      return itemTemplate(reservation, index);
    });

    return <div className='grid grid-nogutter'>{list}</div>;
  };

  return (
    <Panel header='현재 예약 중인 가게'>
      <div className='card'>
        <DataView
          value={reservations}
          listTemplate={listTemplate}
        />
      </div>
    </Panel>
  );
}

export default Reservation;