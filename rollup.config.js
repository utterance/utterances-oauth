import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import { config } from 'dotenv';

config();

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife'
  },
  plugins: [
    replace({
      delimiters: ['<@', '@>'],
      values: {
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        STATE_PASSWORD: process.env.STATE_PASSWORD,
        BOT_TOKEN: process.env.BOT_TOKEN,
        ORIGINS: process.env.ORIGINS
      }
    }),
    typescript(),
  ]
};
