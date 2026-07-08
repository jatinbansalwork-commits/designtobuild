/** Gold locker icon with blinking sparkle stars. */
export function GoldIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="16" fill="#F5F6F8" />
      <mask
        id="gold-icon-mask"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="32"
        height="32"
      >
        <path
          d="M17 31.9693C25.3707 31.4531 32 24.5007 32 16C32 7.16344 24.8366 0 16 0C7.49929 0 0.546938 6.62927 0.030742 15H0V32H17V31.9693Z"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#gold-icon-mask)">
        <path
          d="M2.0903 21.3184L0 31.2955H16.9137L14.6331 21.3184H2.0903Z"
          fill="#FFD939"
        />
        <path
          d="M2.09082 21.3184C2.09082 21.3184 12.5269 24.722 16.9142 31.2955L14.6337 21.3184H2.09082Z"
          fill="#FFE161"
        />
        <path
          d="M14.6328 21.3184H32.8323L35.1129 31.2955H16.9133L14.6328 21.3184Z"
          fill="#FCB81F"
        />
        <path
          d="M35.1129 31.2955C35.1129 31.2955 27.2282 23.6302 14.6328 21.3184H32.8323L35.1129 31.2955Z"
          fill="#FFA70B"
        />
        <path
          d="M14.5078 21.3184L16.8968 31.221L14.8636 21.3184H14.5078Z"
          fill="#FFA70B"
        />
        <path
          d="M35.1132 31.2949H0V31.6357H35.1132V31.2949Z"
          fill="#FFA70B"
        />
        <path
          d="M11.5112 11L9.4209 20.9771H26.3346L24.054 11H11.5112Z"
          fill="#FFD939"
        />
        <path
          d="M11.5117 11C11.5117 11 21.9478 14.4036 26.3349 20.9771L24.0543 11H11.5117Z"
          fill="#FFE161"
        />
        <path
          d="M24.0537 11H42.2532L44.5338 20.9771H26.3342L24.0537 11Z"
          fill="#FCB81F"
        />
        <path
          d="M44.5338 20.9771C44.5338 20.9771 36.6491 13.3118 24.0537 11H42.2532L44.5338 20.9771Z"
          fill="#FFA70B"
        />
        <path
          d="M23.9287 11L26.3175 20.9027L24.2845 11H23.9287Z"
          fill="#FFA70B"
        />
        <path
          d="M44.5341 20.9775H9.4209V21.3183H44.5341V20.9775Z"
          fill="#FFA70B"
        />
        <path
          d="M21.0134 21.3184L18.9229 31.2955H35.8367L33.5562 21.3184H21.0134Z"
          fill="#FFD939"
        />
        <path
          d="M21.0137 21.3184C21.0137 21.3184 31.4497 24.722 35.837 31.2955L33.5565 21.3184H21.0137Z"
          fill="#FFE161"
        />
        <path
          d="M54.036 31.2949H18.9229V31.6357H54.036V31.2949Z"
          fill="#FFA70B"
        />
      </g>
      <path
        className="gold-icon-star-blink"
        d="M18 8C18 5.7909 16.2091 4 14 4C16.2091 4 18 2.2091 18 0C18 2.2091 19.7909 4 22 4C19.7909 4 18 5.7909 18 8Z"
        fill="#FFD939"
      />
      <path
        className="gold-icon-star-blink gold-icon-star-blink--delayed"
        d="M7 14C7 10.1341 3.86593 7 0 7C3.86593 7 7 3.86593 7 0C7 3.86593 10.1341 7 14 7C10.1341 7 7 10.1341 7 14Z"
        fill="#FFD939"
      />
    </svg>
  );
}
