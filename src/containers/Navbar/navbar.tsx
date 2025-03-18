"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

import ProfileSelect from "./components/ProfileSelector/profileSelector";
import { NavbarProps, ResponsiveMenuProps } from "./types";

function ResponsiveMenu({
  menuItems,
  onCloseMenu,
  profileSelectOptions
}: ResponsiveMenuProps) {
  const pathname = usePathname();

  return (
    <div className="absolute inset-0 z-30 flex h-screen w-[14.5rem] flex-col items-center justify-start rounded-sm bg-white text-green-500 shadow-[0_100px_200px_50px_rgba(0,0,0,0.9)] lg:hidden">
      {/* Certifique-se de que esses elementos estão atrás */}
      <div className="absolute bottom-0 z-10">
        <BlackShape />
      </div>
      <div className="absolute bottom-0 z-10">
        <Stroke />
      </div>

      {/* Conteúdo interativo com z-index maior */}
      <button onClick={onCloseMenu} className="absolute left-4 top-6 z-20">
        <FiX size={32} color="black" />
      </button>

      <ul className="z-20 mt-[6rem] flex flex-col justify-center gap-[1.5rem]">
        {menuItems.map((button) => (
          <li
            key={button.label}
            className="flex w-full cursor-pointer items-center justify-start text-[1.25rem] transition-colors hover:text-green-300"
          >
            <Link
              href={button.href}
              onClick={onCloseMenu}
              className={`w-full text-center ${
                pathname === button.href && "border-b-4 border-b-green-500"
              }`}
            >
              {button.label}
            </Link>
            &nbsp;&nbsp;
            <Arrow />
          </li>
        ))}
      </ul>

      {profileSelectOptions && (
        <div className="z-20 mt-8 flex w-full cursor-pointer justify-center lg:hidden">
          <ProfileSelect
            options={profileSelectOptions}
            onCloseMenu={onCloseMenu}
          />
        </div>
      )}
    </div>
  );
}
export default function Navbar({
  menuItems,
  profileSelectOptions
}: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-around bg-[#202425] px-4 text-green-500">
      <div className="order-2 flex h-full items-center gap-10 lg:order-1">
        <h1 className="hidden cursor-pointer lg:flex lg:items-center lg:space-x-2">
          <Logo />
        </h1>
        <FiMenu
          size={32}
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden"
        />
      </div>
      <div className="order-3 hidden items-center space-x-4 lg:flex">
        {profileSelectOptions && (
          <ProfileSelect
            options={profileSelectOptions}
            onCloseMenu={() => setIsMenuOpen(false)}
          />
        )}
      </div>
      <ul className="align-center order-2 hidden h-full items-center lg:flex lg:gap-[4rem] xl:gap-[6rem] ">
        {menuItems.map((button) => (
          <li
            key={button.label}
            className={`group relative flex h-[50%] cursor-pointer items-center text-[1.1rem] font-bold`}
          >
            <Link href={button.href} className="flex h-full items-center">
              {button.label}
            </Link>
            {pathname === button.href && (
              <span className="absolute bottom-2 left-0 right-0 h-[2px] bg-green-500"></span>
            )}
            <span className="absolute bottom-2 left-0 right-0 h-[2.1px] origin-right scale-x-0 transform bg-green-500 transition-transform duration-300 ease-in-out group-hover:h-[2.1px] group-hover:origin-left group-hover:scale-x-100"></span>
          </li>
        ))}
      </ul>

      <h1 className="order-2 ml-auto flex cursor-pointer items-center  space-x-2 lg:hidden">
        <Logo />
      </h1>
      {isMenuOpen && (
        <ResponsiveMenu
          onCloseMenu={() => setIsMenuOpen(false)}
          menuItems={menuItems}
          profileSelectOptions={profileSelectOptions}
        />
      )}
    </nav>
  );
}
const Stroke: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="232"
      height="396"
      viewBox="0 0 232 396"
      fill="none"
    >
      <path
        d="M-356.287 841.788C-380.214 777.228 -378.891 684.089 -349.082 621.856C-334.245 590.89 -312.447 561.954 -282.009 543.389C-251.578 524.816 -211.7 517.874 -177.83 530.5C-147.048 541.979 -124.174 568.654 -115.314 598.424C-106.455 628.194 -110.747 660.528 -123.55 688.953C-130.76 704.956 -141.054 720.365 -156.466 730.103C-171.884 739.834 -193.171 742.806 -209.328 734.088C-227.214 724.438 -234.605 702.927 -231.928 683.857C-227.054 649.133 -194.906 622.524 -160.025 609.549C-125.144 596.575 -86.9559 594.152 -50.0126 587.817C-13.0631 581.489 25.0416 569.985 49.8959 543.777C87.3474 504.287 83.7476 444.314 71.126 392.811C60.5677 349.73 44.8687 306.996 17.3709 270.954C-10.1268 234.912 -50.6094 205.966 -97.2165 197.891C-128.888 192.407 -162.256 199.882 -187.514 218.414C-272.658 280.895 -153.96 386.243 -3.82716 349.568C51.4113 336.079 103.642 282.617 139.583 241.323C175.525 200.03 199.049 150.282 214.394 99.0362C223.847 67.4628 230.377 34.5506 226.577 1.91841"
        stroke="#00FF5F"
        stroke-width="30"
        stroke-miterlimit="10"
      />
    </svg>
  );
};
const BlackShape: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="232"
      height="107"
      viewBox="0 0 232 107"
      fill="none"
    >
      <path
        d="M32.8604 112.324C-102.641 143.824 -129.061 182.299 77.0668 280.813C283.195 379.326 78.463 245.572 78.463 245.572L216.212 217.904C216.212 217.904 322.361 9.82466 236.861 1.32459C151.361 -7.17549 168.361 80.8245 32.8604 112.324Z"
        fill="#202425"
        stroke="#202425"
      />
    </svg>
  );
};

const Arrow: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
    >
      <path
        d="M7.2735 6L1.37607 12L0 10.6L4.52137 6L0 1.4L1.37607 0L7.2735 6Z"
        fill="#00DC52"
      />
    </svg>
  );
};
const Logo: React.FC = () => {
  return (
    <svg
      width="141"
      height="40"
      viewBox="0 0 141 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.6008 0H11.3992C5.11498 0 0 5.11304 0 11.3992V28.6008C0 34.885 5.11306 40 11.3992 40H28.6008C34.8851 40 40 34.887 40 28.6008V11.3992C40 5.11496 34.887 0 28.6008 0ZM37.4733 11.3973V28.5989C37.4733 33.4911 33.493 37.4713 28.6008 37.4713H11.3992C6.507 37.4713 2.52679 33.4911 2.52679 28.5989V11.3973C2.52679 6.50506 6.507 2.52484 11.3992 2.52484H28.6008C33.493 2.52484 37.4733 6.50506 37.4733 11.3973Z"
        fill="#00FF5F"
      />
      <path
        d="M28.5008 19.971C29.4775 18.3641 30.005 16.3412 29.9501 14.3698C29.8893 12.1408 29.099 10.1932 27.7281 8.88159C25.3414 6.60111 21.3013 5.56291 17.1867 6.17117C15.5197 6.41685 13.9527 6.93199 12.6524 7.66111C11.2404 8.45165 10.1775 9.45815 9.49692 10.6489C8.04956 12.9492 7.95738 15.7607 8.01425 17.6766C8.01425 18.1561 8.01228 20.4643 8.00836 23.1331C8.00248 28.6966 7.99855 32.6434 8.00051 32.7226L8.00836 33H10.5912L10.6069 32.7305C10.652 31.8964 10.6383 29.1583 10.6207 25.9901C10.5971 21.6709 10.5677 16.2976 10.707 15.0316C10.905 13.6506 11.3385 12.5054 11.9896 11.6277C13.2683 10.0842 15.2177 9.10945 17.63 8.80829C19.7794 8.54081 22.1387 8.82216 24.2764 9.60081C25.8179 10.1635 26.5455 11.4632 26.8829 12.4559C27.5222 14.3262 27.3163 16.7216 26.3965 18.3978C24.7432 17.3437 22.8761 16.6859 20.9797 16.4957C19.9461 16.3788 17.9418 16.2798 16.1237 16.9197C14.3194 17.5538 13.2192 18.7703 12.9388 20.4326C12.7662 21.4232 12.7525 22.8181 13.6664 23.8345C14.5038 24.7221 15.6629 25.2551 17.1142 25.4156C18.5674 25.578 19.9696 25.3264 20.8894 25.0867H20.8973C23.1919 24.4091 25.0119 23.4957 26.4573 22.295C26.5789 22.1979 26.6966 22.0949 26.8084 21.9939C27.5909 22.6754 28.3459 23.4402 28.7401 24.3893L28.7558 24.419C29.1578 25.1322 29.3952 26.7827 29.4442 29.19C29.4814 31.0365 29.3912 32.679 29.3912 32.6969L29.3736 32.998H31.9898L31.9957 32.7187C32.0055 32.3046 32.1938 22.7388 28.5008 19.969V19.971ZM24.6471 20.3949C23.6606 21.0963 21.6818 22.0256 19.7716 22.6695C17.6809 22.9706 16.2199 22.6715 15.859 21.869C15.6256 21.3519 15.9041 20.6664 16.5807 20.0799C17.2358 19.5133 18.4419 18.9407 20.0403 18.9407C21.3445 18.9407 22.9075 19.3211 24.6471 20.3969V20.3949Z"
        fill="#00FF5F"
      />
      <path
        d="M109.592 15.3466C108.804 14.8996 107.878 14.6738 106.834 14.6738C105.791 14.6738 104.862 14.8996 104.076 15.3466C103.286 15.7959 102.666 16.4364 102.231 17.2543C101.8 18.0677 101.581 19.0354 101.581 20.1321C101.581 21.2288 101.8 22.1758 102.231 22.9891C102.664 23.807 103.286 24.4475 104.076 24.8876C104.862 25.3277 105.791 25.5489 106.834 25.5489C107.878 25.5489 108.788 25.3254 109.581 24.8876C110.378 24.4452 111.002 23.807 111.438 22.9891C111.869 22.1758 112.087 21.215 112.087 20.1321C112.087 19.0492 111.869 18.0677 111.438 17.2543C111.005 16.4364 110.382 15.7936 109.592 15.3466ZM110.454 20.1321C110.454 20.9316 110.302 21.6343 110.002 22.2195C109.707 22.7979 109.283 23.2471 108.747 23.5559C108.205 23.8646 107.56 24.0236 106.832 24.0236C106.104 24.0236 105.463 23.8669 104.929 23.5582C104.397 23.2495 103.973 22.8002 103.671 22.2218C103.364 21.6366 103.21 20.9362 103.21 20.1367C103.21 19.3372 103.364 18.616 103.671 18.0308C103.973 17.4525 104.397 16.9986 104.931 16.6829C105.466 16.3673 106.099 16.2083 106.811 16.2083C107.523 16.2083 108.203 16.3696 108.744 16.6852C109.283 16.9986 109.705 17.4548 110.002 18.04C110.302 18.6322 110.454 19.3372 110.454 20.139V20.1321Z"
        fill="#00FF5F"
      />
      <path
        d="M121.055 15.3466C120.267 14.8996 119.341 14.6738 118.297 14.6738C117.253 14.6738 116.325 14.8996 115.539 15.3466C114.749 15.7959 114.129 16.4364 113.694 17.2543C113.263 18.0677 113.044 19.0354 113.044 20.1321C113.044 21.2288 113.263 22.1758 113.694 22.9891C114.127 23.807 114.749 24.4475 115.539 24.8876C116.325 25.3277 117.253 25.5489 118.297 25.5489C119.341 25.5489 120.251 25.3254 121.044 24.8876C121.841 24.4452 122.465 23.807 122.901 22.9891C123.331 22.1758 123.55 21.215 123.55 20.1321C123.55 19.0492 123.331 18.0677 122.901 17.2543C122.467 16.4364 121.845 15.7936 121.055 15.3466ZM121.917 20.1321C121.917 20.9316 121.765 21.6343 121.465 22.2195C121.17 22.7979 120.746 23.2471 120.209 23.5559C119.668 23.8646 119.023 24.0236 118.295 24.0236C117.567 24.0236 116.926 23.8669 116.392 23.5582C115.859 23.2495 115.436 22.8002 115.134 22.2218C114.827 21.6366 114.673 20.9362 114.673 20.1367C114.673 19.3372 114.827 18.616 115.134 18.0308C115.436 17.4525 115.859 16.9986 116.394 16.6829C116.929 16.3673 117.562 16.2083 118.274 16.2083C118.986 16.2083 119.666 16.3696 120.207 16.6852C120.746 16.9986 121.168 17.4548 121.465 18.04C121.765 18.6322 121.917 19.3395 121.917 20.139V20.1321Z"
        fill="#00FF5F"
      />
      <path
        d="M127.196 13.9687C127.196 13.2729 127.369 12.7476 127.712 12.4043C128.056 12.061 128.56 11.8882 129.215 11.8882C129.516 11.8882 129.793 11.9112 130.042 11.9573C130.291 12.0034 130.521 12.0656 130.726 12.1439L130.996 12.2453V10.6808L130.855 10.6371C130.632 10.5679 130.364 10.4988 130.067 10.4366C129.761 10.3721 129.424 10.3398 129.072 10.3398C128.358 10.3398 127.731 10.4827 127.21 10.7638C126.685 11.0495 126.27 11.4711 125.98 12.0172C125.692 12.5563 125.544 13.2222 125.544 13.9917V14.8396H123.798V16.328H125.544V25.3875H127.196V16.328H131.141V14.8396H127.196V13.971V13.9687Z"
        fill="#00FF5F"
      />
      <path
        d="M140.025 20.6535C139.684 20.2849 139.2 20.013 138.585 19.8471C137.992 19.6881 137.191 19.5568 136.2 19.46C135.241 19.3656 134.52 19.2665 134.055 19.1651C133.624 19.0706 133.313 18.9255 133.131 18.7296C132.956 18.543 132.866 18.255 132.866 17.8702C132.866 17.5477 132.974 17.2643 133.198 17.0039C133.426 16.7389 133.767 16.527 134.209 16.3749C134.665 16.2182 135.195 16.1399 135.788 16.1399C136.428 16.1399 136.967 16.2275 137.384 16.4026C137.792 16.5731 138.087 16.8173 138.285 17.1514C138.386 17.3242 138.465 17.5269 138.516 17.7573L138.55 17.914H140.135L140.101 17.6836C140.029 17.209 139.889 16.7781 139.681 16.4072C139.359 15.8312 138.866 15.3911 138.211 15.0985C137.571 14.8151 136.744 14.6699 135.746 14.6699C134.861 14.6699 134.073 14.8059 133.403 15.0754C132.721 15.3473 132.186 15.7321 131.808 16.2159C131.426 16.709 131.232 17.2919 131.232 17.9509C131.232 18.6421 131.412 19.1928 131.767 19.5844C132.113 19.9692 132.599 20.2434 133.209 20.4047C133.79 20.5567 134.603 20.6904 135.624 20.801C136.571 20.8954 137.285 20.9922 137.751 21.0867C138.181 21.1742 138.488 21.3102 138.663 21.4922C138.831 21.665 138.914 21.9322 138.914 22.2894C138.914 22.6695 138.808 22.9806 138.592 23.2409C138.37 23.5036 138.022 23.711 137.555 23.8561C137.069 24.0059 136.467 24.0842 135.764 24.0842C135.062 24.0842 134.47 23.9898 134.023 23.8008C133.592 23.6211 133.274 23.3631 133.078 23.0382C132.986 22.8838 132.912 22.711 132.861 22.5175L132.822 22.3677H131.251L131.29 22.6004C131.361 23.0267 131.493 23.4207 131.684 23.7686C131.99 24.3331 132.493 24.7754 133.172 25.0865C133.841 25.3906 134.718 25.5473 135.783 25.5473C136.774 25.5473 137.633 25.4183 138.336 25.1648C139.055 24.9068 139.608 24.5266 139.979 24.0404C140.354 23.5474 140.543 22.9437 140.543 22.2456C140.543 21.5475 140.366 21.0314 140.018 20.6512L140.025 20.6535Z"
        fill="#00FF5F"
      />
      <path
        d="M73.0552 15.9851C72.7926 15.5451 72.4401 15.1718 72.0115 14.8723C71.6198 14.5981 71.1291 14.3977 70.5899 14.2917C69.9701 14.1673 69.3388 14.1373 68.7121 14.2018C68.3273 14.241 67.9909 14.2986 67.6799 14.3792C67.385 14.4553 67.0809 14.5635 66.7168 14.7179C66.3205 14.8861 65.938 15.105 65.5487 15.3815C64.968 14.9437 64.2976 14.6096 63.5948 14.4115C62.9889 14.2387 62.3299 14.1557 61.6433 14.1603C60.9913 14.1649 60.4038 14.2456 59.8923 14.4023C59.3509 14.5681 58.8716 14.8239 58.4246 15.181C58.0744 15.4621 57.7564 15.8423 57.503 16.2824C56.8993 17.3261 56.7426 18.5495 56.6758 19.379C56.6459 19.7522 56.6297 21.7038 56.6321 25.0193V25.4063H58.2679V20.6992C58.2679 20.0679 58.2887 19.584 58.3371 19.1278C58.344 19.061 58.3532 18.9965 58.3601 18.9274C58.4407 18.3629 58.5652 17.8814 58.7334 17.4643C58.8393 17.227 58.966 17.0081 59.1066 16.8123C59.2356 16.6533 59.3785 16.5082 59.5329 16.3814C59.7034 16.257 59.8923 16.1487 60.0835 16.0635C60.3485 15.9598 60.6434 15.8838 60.9498 15.8354C61.4452 15.7755 61.9567 15.7778 62.4659 15.8377C62.8898 15.9022 63.2953 16.0105 63.664 16.1602C63.8875 16.2593 64.1018 16.3745 64.3068 16.5058C64.1893 16.6418 64.0741 16.7846 63.9612 16.9321C63.6433 17.3514 63.3806 17.8007 63.1801 18.2684C62.9405 18.8283 62.8 19.303 62.7331 19.7638C62.6986 20.0034 62.6663 20.2868 62.6709 20.5748C62.6755 20.849 62.7032 21.1324 62.7539 21.4388C62.853 22.0378 63.0972 22.577 63.4636 22.9963C63.6571 23.2198 63.9105 23.4133 64.1778 23.5401C64.5165 23.7037 64.8736 23.7981 65.2953 23.8373C66.0878 23.9087 66.8113 23.6806 67.279 23.2083C67.7974 22.6853 67.9426 21.9918 68.0117 21.4457C68.0716 20.9734 68.0716 20.4527 68.0117 19.8974C67.9633 19.4458 67.885 19.0403 67.7652 18.6555C67.5302 17.8883 67.1753 17.1855 66.7076 16.5588C66.938 16.4137 67.18 16.287 67.4219 16.1787C67.8182 16.0174 68.2352 15.9045 68.6522 15.8423C69.1061 15.7893 69.56 15.7893 69.9955 15.84C70.2627 15.8815 70.5139 15.946 70.7351 16.0312C70.894 16.1026 71.0461 16.1902 71.1821 16.2893C71.2973 16.3837 71.4032 16.492 71.5 16.6072C71.6175 16.7708 71.7235 16.9551 71.8111 17.1487C71.9539 17.5081 72.0576 17.9228 72.129 18.409C72.2189 19.1163 72.2304 19.8144 72.2304 20.4043V24.6414C72.2304 24.7543 72.2304 24.8211 72.2304 24.8787C72.2304 24.9709 72.2304 25.0377 72.2304 25.2312V25.2358L72.235 25.4386H73.6658L73.8617 25.4478L73.8663 20.4043C73.8663 19.4089 73.8317 18.3514 73.5898 17.3491C73.4631 16.8307 73.2833 16.3722 73.0506 15.9851H73.0552ZM66.0832 22.0954C66.051 22.1162 66.0187 22.1369 65.9842 22.153C65.9196 22.1761 65.8551 22.1922 65.786 22.206C65.6362 22.2199 65.4772 22.2176 65.3136 22.2014C65.1938 22.1807 65.0786 22.1507 64.9703 22.1116C64.9058 22.0793 64.8414 22.0424 64.7815 22.001C64.7308 21.9549 64.6801 21.9065 64.6363 21.8558C64.5787 21.7706 64.5257 21.6784 64.4796 21.5816C64.4174 21.4134 64.3713 21.2314 64.339 21.031C64.3022 20.7084 64.2999 20.3881 64.3321 20.0909C64.3874 19.7338 64.4888 19.3698 64.634 19.0126C64.816 18.5956 65.0533 18.1924 65.3321 17.8215C65.3805 17.7592 65.4312 17.6993 65.4819 17.6394C65.6916 17.939 65.8712 18.2638 66.021 18.6048C66.1938 19.0311 66.3159 19.4665 66.3781 19.8928C66.4404 20.402 66.4427 20.895 66.3874 21.3605C66.3597 21.5356 66.3205 21.6876 66.2699 21.8259C66.2376 21.8927 66.203 21.9549 66.1639 22.0125C66.1385 22.0401 66.1109 22.0678 66.0832 22.0931V22.0954Z"
        fill="#00FF5F"
      />
      <path
        d="M80.324 23.5314L76.4786 14.8613H74.5801L79.4485 25.6419C79.0937 26.4276 78.8149 27.0036 78.702 27.1925C78.4854 27.5543 78.2573 27.81 78.02 27.9575C77.785 28.1003 77.4924 28.1741 77.1491 28.1741C76.9601 28.1741 76.7643 28.151 76.5661 28.1072C76.3634 28.0612 76.1883 28.0128 76.0454 27.9598L75.7782 27.863V29.3514L75.9049 29.4021C76.0524 29.462 76.2505 29.5173 76.5108 29.5749C76.7712 29.6325 77.0338 29.6625 77.2942 29.6625C77.9439 29.6625 78.4923 29.5311 78.9278 29.2754C79.3586 29.0196 79.7572 28.5842 80.1075 27.9828C80.4462 27.3999 80.8355 26.5405 81.2618 25.4299L85.4574 14.8636H83.7547L80.3263 23.5337L80.324 23.5314Z"
        fill="#00FF5F"
      />
      <path
        d="M99.3839 19.1884C99.135 18.8175 98.8194 18.4627 98.4231 18.1055C98.6766 17.7 98.8678 17.2692 98.9945 16.8199C99.1558 16.2462 99.218 15.6241 99.1811 14.9674C99.1419 14.29 99.0337 13.7279 98.8447 13.2486C98.6281 12.6957 98.3471 12.2464 97.983 11.8777C97.6512 11.539 97.2388 11.2556 96.7895 11.0529C95.8979 10.6543 94.8841 10.463 93.4994 10.4377C92.845 10.4262 92.2276 10.4607 91.6124 10.546C91.0525 10.6243 90.5617 10.7441 90.1124 10.9169C89.8106 11.0321 89.5548 11.1473 89.3313 11.2718C89.1148 11.3916 88.9028 11.5367 88.6424 11.7395C88.26 12.039 87.9236 12.4169 87.6402 12.8638C87.3614 13.3016 87.1495 13.8085 87.0089 14.3661C86.9398 14.638 86.8891 14.9306 86.843 15.3153C86.8223 15.4882 86.8015 15.6725 86.7992 15.8568C86.7946 16.0711 86.7969 16.2853 86.7992 16.495C86.7992 16.601 86.7992 16.7047 86.7992 16.8107L86.79 25.4116H88.3107L88.3199 16.0849C88.3199 15.9628 88.3199 15.8384 88.3291 15.7162C88.3383 15.5987 88.3498 15.4743 88.366 15.3384C88.4305 14.9052 88.5365 14.5043 88.6793 14.1518C88.7945 13.8938 88.9328 13.6541 89.0872 13.4422C89.2577 13.2302 89.4512 13.0343 89.6609 12.8685C89.8982 12.6934 90.1654 12.5413 90.4465 12.4146C90.8843 12.2372 91.3612 12.1127 91.905 12.0321C92.6031 11.9445 93.3473 11.9307 94.1744 11.9883C94.3541 12.0021 94.5431 12.0206 94.7274 12.0436C95.2389 12.1173 95.6767 12.2302 96.0569 12.3846C96.2781 12.4837 96.4808 12.6012 96.6628 12.7302C96.8126 12.8523 96.9508 12.9906 97.0752 13.138C97.1973 13.3062 97.3057 13.4929 97.3909 13.6841C97.4992 13.9606 97.5798 14.2693 97.6282 14.5965C97.6835 15.055 97.6881 15.4974 97.6397 15.9029C97.589 16.2231 97.5061 16.5319 97.3932 16.8153C97.3379 16.9397 97.2757 17.0641 97.2066 17.1816C96.9163 16.9973 96.6306 16.8452 96.3426 16.7185C95.9647 16.5503 95.6214 16.4259 95.2988 16.336C94.9601 16.2439 94.5846 16.1724 94.1537 16.1241C93.4625 16.0457 92.7528 16.0665 92.0432 16.1909C91.7483 16.2416 91.4926 16.313 91.2622 16.4075C91.1078 16.4697 90.958 16.5342 90.8106 16.6171C90.6562 16.7047 90.518 16.813 90.4028 16.9051C89.9788 17.2484 89.6724 17.7876 89.5802 18.3498C89.5157 18.753 89.5134 19.094 89.5733 19.4234C89.6263 19.7114 89.7622 19.9856 89.9903 20.2621C90.359 20.7091 90.9281 20.9303 91.3428 21.0386C91.799 21.1561 92.2967 21.2068 92.822 21.1883C93.2275 21.1745 93.6053 21.1192 93.9486 21.0248C94.2758 20.9349 94.5731 20.8404 94.8542 20.7367C95.2965 20.5755 95.6905 20.4027 96.0523 20.2137C96.467 19.9971 96.8725 19.7276 97.2619 19.4142C97.3218 19.3658 97.3817 19.3152 97.4416 19.2622C97.6536 19.4557 97.8309 19.6423 97.9807 19.8313C98.1535 20.0663 98.3079 20.3335 98.4323 20.6146C98.6166 21.0685 98.748 21.5754 98.8332 22.1606C98.9231 22.8749 98.9461 23.6675 98.9069 24.6559C98.9 24.8425 98.8885 25.0292 98.8793 25.2158L98.8678 25.4093H100.391L100.4 25.2365C100.478 23.8956 100.506 22.4625 100.172 21.0639C99.999 20.3404 99.7341 19.7091 99.3862 19.1884H99.3839ZM96.1767 18.3405C95.8403 18.5917 95.4601 18.8198 95.0431 19.0179C94.9509 19.0617 94.8564 19.1032 94.7666 19.1423C94.3657 19.3059 93.9371 19.4511 93.4533 19.5801C93.368 19.6032 93.2805 19.6216 93.1906 19.6354C92.8197 19.6792 92.4418 19.6792 92.0709 19.6354C91.8428 19.5986 91.6423 19.5479 91.458 19.4787C91.3682 19.4373 91.2852 19.3889 91.2115 19.3382C91.1792 19.3105 91.1492 19.2806 91.1216 19.2506C91.1055 19.2276 91.0916 19.2023 91.0778 19.1746C91.0686 19.1447 91.0594 19.1124 91.0525 19.0801C91.0433 18.9603 91.0455 18.8313 91.0594 18.6954C91.0778 18.5871 91.1055 18.4834 91.1423 18.3866C91.1746 18.3221 91.2115 18.2576 91.2529 18.2C91.3036 18.1424 91.3589 18.0871 91.4188 18.0364C91.5202 17.965 91.6331 17.9005 91.7552 17.8452C91.981 17.7576 92.2321 17.6954 92.5178 17.6516C93.057 17.5848 93.6077 17.5848 94.1514 17.6516C94.6445 17.7254 95.1283 17.8567 95.5822 18.041C95.7827 18.1286 95.9831 18.23 96.1813 18.3405H96.1767Z"
        fill="#00FF5F"
      />
    </svg>
  );
};
