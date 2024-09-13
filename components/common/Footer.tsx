import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Link,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import * as Yup from 'yup'
import { request } from '@octokit/request'
import { ToastContext } from 'contexts/ToastContext'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'

type DrawerId = 'bug' | 'feature'

type DrawerData = {
  id: DrawerId
  header: 'Report a Bug' | 'Suggest a Feature'
  form: React.ReactNode
}

const REPOSITORY_NAME = 'shl-trading-cards' as const
const REPOSITORY_OWNER = 'GuthrieW' as const

const bugValidationSchema = Yup.object({}).shape({
  description: Yup.string().required('Description is required'),
  reproductionSteps: Yup.string().notRequired(),
  operatingSystem: Yup.string().notRequired(),
  browser: Yup.string().notRequired(),
  device: Yup.string().notRequired(),
})
type BugFormValues = Yup.InferType<typeof bugValidationSchema>

const featureValidationSchema = Yup.object({}).shape({
  description: Yup.string().required('Description is required'),
  desiredFunctionality: Yup.string().notRequired(),
})
type FeatureFormValues = Yup.InferType<typeof featureValidationSchema>

export const Footer = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [drawerId, setDrawerId] = useState<DrawerId>(null)

  const openDrawer = (source: DrawerId) => {
    setDrawerId(source)
    onOpen()
  }

  const submitGithubIssue = async (
    issueData: BugFormValues | FeatureFormValues
  ) => {
    const { addToast } = useContext(ToastContext)
    const [uid] = useCookie(config.userIDCookieName)
    const bugCreator: string = uid ? `by ${uid}` : ' anonymously'

    const requestWithAuth = request.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_ISSUES_TOKEN}`,
      },
    })

    const requestData: { title: string; body: string; label: 'bug' | 'story' } =
      {
        title: '',
        body: '',
        label: null,
      }

    if ('reproductionSteps' in issueData) {
      requestData.title = `Bug Report (Submitted ${bugCreator})`
      requestData.label = 'bug'
      requestData.body = `
    # Description
    ${issueData.description}
    
    # Reproduction Steps
    ${issueData.reproductionSteps}
    
    # Operating System
    ${issueData.operatingSystem}
    
    # Browser
    ${issueData.browser}
    
    # Device
    ${issueData.device}`
    } else if ('desiredFunctionality' in issueData) {
      requestData.title = `Feature Request (Submitted ${bugCreator})`
      requestData.label = 'story'
      requestData.body = `
    # Description
    ${issueData.description}
    
    # Desired Functionality
    ${issueData.desiredFunctionality}`
    }

    const result = await requestWithAuth(
      `POST /repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/issues`,
      {
        owner: 'OWNER',
        repo: 'shl-trading-cards',
        title: requestData.title,
        body: requestData.body,
        labels: ['bug'],
        assignees: ['GuthrieW'],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    )

    addToast({
      title: 'Ticket Submitted Trade Partner',
      status: 'success',
    })
    console.log('result', result)
  }

  const BugForm = () => {
    const [bugError, setBugError] = useState<string>('')
    const {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      isValid,
      handleSubmit,
    } = useFormik<BugFormValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        description: '',
        reproductionSteps: '',
        operatingSystem: '',
        browser: '',
        device: '',
      },
      onSubmit: async (
        { description, reproductionSteps, operatingSystem, browser, device },
        { setSubmitting }
      ) => {
        try {
          setSubmitting(true)
          await submitGithubIssue({
            description,
            reproductionSteps,
            operatingSystem,
            browser,
            device,
          })
          onClose()
        } catch (error) {
          console.error(error)
          const errorMessage: string =
            'message' in error
              ? error.message
              : 'Error submittings, please message caltroit_red_flames on Discord'
          setBugError(errorMessage)
        } finally {
          setSubmitting(false)
        }
      },
    })

    return (
      <div>
        {bugError && (
          <div className="text-red dark:text-redDark">{bugError}</div>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.description && touched.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              isRequired
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.description}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Reproduction Steps</FormLabel>
            <Textarea
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="reproductionSteps"
              value={values.reproductionSteps}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Operating System</FormLabel>
            <Input
              placeholder="Windows/Mac/Linux/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="operatingSystem"
              value={values.operatingSystem}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Browser</FormLabel>
            <Input
              placeholder="Chrome/Edge/Firefox/Safari/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="browser"
              value={values.browser}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Device</FormLabel>
            <Input
              placeholder="Desktop/Tablet/Mobile/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="device"
              value={values.device}
              className="font-mont"
            />
          </FormControl>
          <Button
            disabled={!isValid}
            type="submit"
            className="mt-6"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit
          </Button>
        </form>
      </div>
    )
  }

  const bugDrawerData: DrawerData = {
    id: 'bug',
    header: 'Report a Bug',
    form: <BugForm />,
  } as const

  const FeatureForm = () => {
    const [featureError, setFeatureError] = useState<string>('')

    const {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      isValid,
      handleSubmit,
    } = useFormik<FeatureFormValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        description: '',
        desiredFunctionality: '',
      },
      onSubmit: async (
        { description, desiredFunctionality },
        { setSubmitting }
      ) => {
        try {
          setSubmitting(true)
          await submitGithubIssue({ description, desiredFunctionality })
          onClose()
        } catch (error) {
          console.error(error)
          const errorMessage: string =
            'message' in error
              ? error.message
              : 'Error submittings, please message caltroit_red_flames on Discord'
          setFeatureError(errorMessage)
        } finally {
          setSubmitting(false)
        }
      },
    })

    return (
      <div>
        {featureError && (
          <div className="text-red dark:text-redDark">{featureError}</div>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.description && touched.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              isRequired
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.description}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Desired Functionality</FormLabel>
            <Textarea
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.desiredFunctionality}
              className="font-mont"
            />
          </FormControl>
          <Button
            disabled={!isValid}
            type="submit"
            className="mt-6"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit
          </Button>
        </form>
      </div>
    )
  }

  const featureDrawerData: DrawerData = {
    id: 'feature',
    header: 'Suggest a Feature',
    form: <FeatureForm />,
  } as const

  return (
    <>
      <footer className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-primary text-secondaryText dark:bg-primaryDark dark:text-secondaryTextDark">
        <div className="font-mont text-xs">
          &copy; {new Date().getFullYear()} |{' '}
          <span className="hidden sm:inline">
            Made with ♥︎ by the SHL Dev Team |{' '}
          </span>
          <Link href="https://simulationhockey.com/index.php" isExternal>
            Visit Forum
          </Link>{' '}
          |{' '}
          <Button onClick={() => openDrawer('bug')}>
            {bugDrawerData.header}
          </Button>{' '}
          |{' '}
          <Button onClick={() => openDrawer('feature')}>
            {featureDrawerData.header}
          </Button>
        </div>
      </footer>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {drawerId === 'bug' && bugDrawerData.header}
            {drawerId === 'feature' && featureDrawerData.header}
          </DrawerHeader>
          <DrawerBody>
            {drawerId === 'bug' && bugDrawerData.form}
            {drawerId === 'feature' && featureDrawerData.form}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
