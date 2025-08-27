import { DownloadIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { BaseRequest } from '@pages/api/v3/cards/base-requests'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'

const requestCardsValidationSchema = Yup.object({}).shape({
  season: Yup.number().integer().required('Season number is required'),
})

function toCsv(data: Photoshopcsv[]): string {
  if (!data || !data.length) return ''

  const headers = Object.keys(data[0])
  const rows = data.map((row) =>
    headers
      .map((field) => {
        const val = (row as any)[field]
        if (typeof val === 'string' && /[",\n]/.test(val)) {
          return `"${val.replace(/"/g, '""')}"`
        }
        return val
      })
      .join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

type RequestBaseCardsValues = Yup.InferType<typeof requestCardsValidationSchema>

export default function RequestBaseCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const router = useRouter()
  const [created, setCreated] = useState<BaseRequest[]>(null)
  const [duplicates, setDuplicates] = useState<BaseRequest[]>(null)
  const [errors, setErrors] = useState<BaseRequest[]>(null)
  const [hasInvalidSeason, setHasInvalidSeason] = useState<BaseRequest[]>(null)
  const [photoshopCsv, setPhotoshopCsv] = useState<Photoshopcsv[]>(null)

  const handleDownloadCsv = () => {
    if (!photoshopCsv?.length) return
    const csvString = toCsv(photoshopCsv)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `photoshop-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const { mutateAsync: requestBaseCards } = mutation<void, { season: number }>({
    mutationFn: async ({ season }: { season: number }) => {
      const response = await axios({
        method: POST,
        url: '/api/v3/cards/base-requests',
        data: { season },
      })

      if (response.data.payload) {
        setCreated(response.data.payload.created)
        setDuplicates(response.data.payload.duplicates)
        setErrors(response.data.payload.errors)
        setHasInvalidSeason(response.data.payload.hasInvalidSeason)
        setPhotoshopCsv(response.data.payload.photoshopCsv)
      }
    },
  })

  const { isSubmitting, handleChange, handleBlur, isValid, handleSubmit } =
    useFormik<RequestBaseCardsValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        season: 0,
      },
      onSubmit: async ({ season }, { setSubmitting }) => {
        try {
          setSubmitting(true)
          onError(null)
          await requestBaseCards({ season })
        } catch (error) {
          console.error(error)
          const errorMessage: string =
            'message' in error
              ? error.message
              : 'Error submitting, please message caltroit_red_flames on Discord'
          onError(errorMessage)
        } finally {
          setSubmitting(false)
        }
      },
      validationSchema: requestCardsValidationSchema,
    })

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-end items-center">
          <Button
            disabled={
              !isValid ||
              isSubmitting || // disable this in dev
              router.pathname.includes('localhost') ||
              router.pathname.includes('cardsdev')
            }
            type="submit"
            className="mt-4 mx-1"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Request Base Cards
          </Button>
        </div>

        <FormControl>
          <FormLabel>Season</FormLabel>
          <Input
            type="number"
            isRequired={true}
            disabled={isSubmitting}
            onChange={handleChange}
            onBlur={handleBlur}
            name="season"
            className="font-mont"
          />
        </FormControl>
      </form>
      <div className="flex flex-col">
        {photoshopCsv && (
          <Button
            leftIcon={<DownloadIcon />}
            mt={2}
            onClick={handleDownloadCsv}
          >
            Photoshop Download as CSV
          </Button>
        )}
        {created && (
          <div className="my-2 p-2 border border-black rounded">
            Created - {created.length}
            <Textarea
              value={JSON.stringify(created, null, 2)}
              disabled={true}
              rows={10}
            />
          </div>
        )}
        {hasInvalidSeason && (
          <div className="my-2 p-2 border border-black rounded">
            Created but invalid season - {hasInvalidSeason.length}
            <Textarea
              value={JSON.stringify(hasInvalidSeason, null, 2)}
              disabled={true}
              rows={10}
            />
          </div>
        )}
        {duplicates && (
          <div className="my-2 p-2 border border-black rounded">
            Duplicates - {duplicates.length}
            <Textarea
              value={JSON.stringify(duplicates, null, 2)}
              disabled={true}
              rows={10}
            />
          </div>
        )}
        {errors && (
          <div className="my-2 p-2 border border-black rounded">
            Errors - {errors.length}
            <Textarea
              value={JSON.stringify(errors, null, 2)}
              disabled={true}
              rows={10}
            />
          </div>
        )}
      </div>
    </div>
  )
}
