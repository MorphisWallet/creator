import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { ProjectForm } from '@/components/project/ProjectForm'

export default function NewProjectPage() {
  return (
    <Layout>
      <Head>
        <title>Kiosk Creator - Project</title>
      </Head>
      <ProjectForm />
    </Layout>
  )
}
