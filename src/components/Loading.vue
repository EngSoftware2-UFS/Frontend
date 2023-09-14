<template>
    <div class="bg h-100 w-100 pt-5 adjustpos">
        <div class="items-center h-100 d-flex flex-col justify-center">
            <div class="d-flex justify-center">
                <div class="homedv bookld my-auto ">
                <div class="bookld__pg"></div>
                <div class="bookld__pg bookld__pg--2"></div>
                <div class="bookld__pg bookld__pg--5"></div>
                </div>
            </div>
            <div class="mt-1 text-white text-center text-xl bg-[#0000008a] rounded-xl px-2">Carregando...</div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LoadingView",
  };
  </script>
  
  <style>
  homedv {
      border: 0;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
  }
  .bg {
    background-color: #454954;
  }
  :root {
      --hue: 223;
      --bg: hsl(var(--hue),10%,30%);
      --fg: hsl(var(--hue),10%,90%);
      --primary: #d22437;
      --white: hsl(var(--hue),10%,100%);
  }
  .adjustpos {
    position: absolute;
    z-index: 999;
    background-color: #0000006f;
  }
  .bookld {
      background-color: var(--primary-l);
      animation-duration: 5s;
      border-radius: 0.25em;
      box-shadow:
          0 0.25em 0.5em hsla(0,0%,0%,0.3),
          0 0 0 0.25em var(--primary) inset;
      padding: 0.25em;
      perspective: 37.5em;
      position: relative;
      width: 8em;
      height: 6em;
      transform: translate3d(0,0,0);
      transform-style: preserve-3d;
  }
  .bookld__pg {
      position: absolute;
      left: 0.25em;
      width: calc(50% - 0.25em);
      animation: ease-in-out infinite;
      background-color: var(--white);
      background-image:
          repeating-linear-gradient(hsl(var(--hue),10%,10%) 0 0.125em,hsla(var(--hue),10%,10%,0) 0.125em 0.5em),
          linear-gradient(90deg,hsla(var(--hue),10%,90%,0) 87.5%,hsl(var(--hue),10%,90%));
      background-repeat: no-repeat;
      background-position: center;
      background-size: 2.5em 4.125em, 100% 100%;
      height: calc(100% - 0.5em);
      transform-origin: 100% 50%;
  }
  
  .bookld__pg--2 {
      animation-name: pg;
      animation-duration: 0.6s;
  }
  .bookld__pg--5 {
      transform: rotateY(180deg);
  }
  @keyframes pg {
      from {
          animation-timing-function: ease-in;
          transform: rotateY(0deg);
      }
      to {
          animation-timing-function: ease-out;
          transform: translate3d(0,0,1px) rotateY(180deg);
      }
  }
  </style>
  