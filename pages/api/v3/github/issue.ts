import { POST } from '@constants/http-methods'
import { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import middleware from '@pages/api/database/middleware'
import { Octokit } from 'octokit'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '..'
import methodNotAllowed from '../lib/methodNotAllowed'

const REPOSITORY_OWNER = 'GuthrieW' as const
const REPOSITORY_NAME = 'shl-trading-cards' as const
const allowedMethods: string[] = [POST] as const
const cors = Cors({
  methods: allowedMethods,
})

type IssueData = {}

export default async function issueEndpoint(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<IssueData>>
): Promise<void> {
  await middleware(req, res, cors)

  if (req.method === POST) {
    const { title, body, label } = req.body

    if (!title || !body || !label) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Please provide a title, body, and label in your request',
      })
      return
    }

    const octokit = new Octokit({
      auth: `token ${process.env.GITHUB_ISSUES_TOKEN}`,
    })

    const githubResponse = await octokit.request(
      `POST /repos/${REPOSITORY_OWNER}/${REPOSITORY_NAME}/issues`,
      {
        owner: REPOSITORY_OWNER,
        repo: REPOSITORY_NAME,
        title,
        body,
        assignees: [REPOSITORY_OWNER],
        labels: [label],
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    )

    if ('status' in githubResponse && githubResponse.status === 201) {
      res.status(StatusCodes.OK).json({
        status: 'success',
        payload: { newIssueUrl: githubResponse?.data?.html_url },
      })
    } else {
      res.status(githubResponse.status).json({
        status: 'error',
        message: githubResponse?.data?.message,
      })
    }
    return
  }

  methodNotAllowed(req, res, allowedMethods)
}
