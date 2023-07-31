import React from "react";

import { App as Layout } from "./components/Layout"
import { setDefaultLanguage }  from './locales/i18n';

export const App = () => {
  setDefaultLanguage('en')

  return (
    <Layout />
  )
}