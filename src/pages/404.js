import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import './404.css'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <section className="error-page">
      <span className="error-code">404</span>
      <br></br>
      <span className="error-code-message">NOT FOUND</span>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>

      <a href="/"> ← Go back home</a>
    </section>
  </Layout>
)

export default NotFoundPage
