import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#15157d',
          borderRadius: '16px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="40" height="40" fill="white">
           <path d="M480-120 338-262l42-42 60 60v-109q-43-16-71.5-53.5T340-492q0-70 65-115t184-59q-9 18-14 36.5T570-592q0 49 22.5 90.5T654-432v27l126-126q12 40 18 80.5t6 80.5q0 119-45 184t-115 65q-12 0-25-1t-25-3v-61q12 2 24.5 3t25.5 1q41 0 74-21.5T742-262l-88 88v14q0 17-11.5 28.5T614-120H480ZM340-572q11-15 25-27t30-22q-5-18-5-37 0-19 5-37-33 16-54 44t-21 61q0 6 1 12t1 12q5-2 9.5-3.5T340-572Zm230-148q22 0 41.5 7.5T646-691q20-13 42-19.5t46-8.5q-42-26-89-33.5T540-760q-63 0-112 20t-78 54q37-12 75.5-18t79.5-6q13 14 31 22t39 8Zm62 108q-26 0-44-18t-18-44q0-26 18-44t44-18q26 0 44 18t18 44q0 26-18 44t-44 18Z"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
