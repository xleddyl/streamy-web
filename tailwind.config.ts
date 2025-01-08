import type { Config } from 'tailwindcss'

export default {
   content: ['./app/components/**/*.{js,vue,ts}', './app/layouts/**/*.vue', './app/pages/**/*.vue'],
   theme: {
      extend: {
         screens: {
            mobile: '980px',
         },
         colors: {
            // https://uicolors.app/create
            'sunset-strip': {
               DEFAULT: '#FFBD00',
               50: '#fffeea',
               100: '#fffbc5',
               200: '#fff785',
               300: '#ffec46',
               400: '#ffdd1b',
               500: '#ffbd00',
               600: '#e29200',
               700: '#bb6702',
               800: '#984f08',
               900: '#7c410b',
               950: '#482100',
            },
            'philippine-silver': {
               DEFAULT: '#B6B6B6',
               50: '#f7f7f7',
               100: '#ededed',
               200: '#dfdfdf',
               300: '#c8c8c8',
               400: '#c8c8c8',
               500: '#999999',
               600: '#888888',
               700: '#7b7b7b',
               800: '#676767',
               900: '#545454',
               950: '#363636',
            },
         },
         borderRadius: {
            small: '10px',
            medium: '20px',
            large: '30px',
         },
         fontFamily: {
            title: ['Unbounded', 'sans-serif'],
            sans: ['Montserrat', 'sans-serif'],
         },
      },
   },
} satisfies Config
