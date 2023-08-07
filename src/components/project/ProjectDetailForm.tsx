import { FormLayout } from '@/components/form/FormLayout'
import { Stack } from '@mantine/core'
import { FormTitle } from '@/components/form/FormTitle'
import { Category, ProjectBlockchain, ProjectStage } from '@prisma/client'
import { FormSelect } from '@/components/form/FormSelect'
import { FormInput } from '@/components/form/FormInput'
import { FormMultiSelect } from '@/components/form/FormMultiSelect'
import { FormTextArea } from '@/components/form/FormTextArea'
import { FormTag } from '@/components/form/FormTag'
import { pascalToNormal } from '@/utils/string'
import { useProjectFormStore } from '@/store'

type Props = {
  isDisabled: boolean
}

export const ProjectDetailForm = ({ isDisabled }: Props) => {
  const blockchainSelectData = Object.values(ProjectBlockchain).map(blockchain => ({
    value: blockchain,
    label: blockchain,
  }))
  const categoriesSelectData = Object.values(Category).map(category => ({
    value: category,
    label: category,
  }))

  const stageData = Object.values(ProjectStage).map(stage => ({
    value: stage,
    label: pascalToNormal(stage),
  }))

  const { name, updateField, blockchain, categories, description, projectStage } = useProjectFormStore()

  return (
    <FormLayout>
      <Stack spacing={24}>
        <Stack spacing={8}>
          <FormTitle
            label={'Blockchain'}
            required={true}
          />
          <FormSelect
            data={blockchainSelectData}
            value={blockchain}
            onChange={val => updateField('blockchain', val as ProjectBlockchain)}
            disabled={isDisabled}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle
            label={'Name of the project'}
            required={true}
          />
          <FormInput
            placeholder={'Name'}
            value={name}
            onChange={e => updateField('name', e.currentTarget.value)}
            disabled={isDisabled}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle
            label={'Category'}
            required={true}
          />
          <FormMultiSelect
            data={categoriesSelectData}
            value={categories}
            placeholder={'Please select project categories'}
            onChange={val => updateField('categories', val as Category[])}
            disabled={isDisabled}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle
            label={'Project stage'}
            required={true}
          />
          <FormTag
            data={stageData}
            value={projectStage}
            onSelected={val => updateField('projectStage', val as ProjectStage)}
          />
        </Stack>
        <Stack spacing={8}>
          <FormTitle
            label={'Description'}
            required={true}
          />
          <FormTextArea
            placeholder={'Your project description'}
            value={description}
            onChange={e => updateField('description', e.currentTarget.value)}
          />
        </Stack>
      </Stack>
    </FormLayout>
  )
}
