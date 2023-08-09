import Head from 'next/head'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { ProjectForm } from '@/components/project/ProjectForm'

export default function NewProjectPage() {
  return (
    <Layout>
      <Head>
        <title>Kiosk - Submit a project</title>
      </Head>
      <ProjectForm />
    </Layout>
  )
}
