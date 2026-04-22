import * as React from 'react'
import ReactQuill from 'react-quill-new'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  Loader2,
  Plus,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'

import {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useGetPoliciesQuery,
  useUpsertPolicyMutation,
} from "../store/api/supportApi"

import 'react-quill-new/dist/quill.snow.css'

export default function SettingsPage() {
  // =========================
  // FAQ
  // =========================
  const { data: faqs = [], isLoading: faqLoading } =
    useGetFAQsQuery()

  const [createFAQ, { isLoading: faqSaving }] =
    useCreateFAQMutation()

  const [question, setQuestion] = React.useState('')
  const [answer, setAnswer] = React.useState('')

  // =========================
  // POLICY
  // =========================
  const {
    data: policies = [],
    isLoading: policyLoading,
  } = useGetPoliciesQuery()

  const [upsertPolicy, { isLoading: policySaving }] =
    useUpsertPolicyMutation()

  const [policyType, setPolicyType] =
    React.useState('PRIVACY_POLICY')

  const [policyTitle, setPolicyTitle] =
    React.useState('')

  const [policyContent, setPolicyContent] =
    React.useState('')

  // =========================
  // HANDLERS
  // =========================
  const handleAddFAQ = async () => {
    if (!question.trim() || !answer.trim()) return

    await createFAQ({
      question,
      answer,
      order: faqs.length + 1,
    }).unwrap()

    setQuestion('')
    setAnswer('')
  }

  const handleSavePolicy = async () => {
    if (!policyTitle.trim() || !policyContent.trim()) return

    await upsertPolicy({
      type: policyType,
      title: policyTitle,
      content: policyContent,
    }).unwrap()

    setPolicyTitle('')
    setPolicyContent('')
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-200">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Settings
        </h1>

        <p className="text-slate-400">
          Manage FAQs, policies.
        </p>
      </div>

      {/* ================= FAQ ================= */}
      <Card className="bg-slate-900 border border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <HelpCircle className="h-5 w-5 text-sky-400" />
                FAQ Management
              </CardTitle>

              <CardDescription className="text-slate-400">
                Add and manage frequently asked questions
              </CardDescription>
            </div>

            <Badge className="bg-sky-900/40 text-sky-400">
              {faqs.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <Input
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />

            <ReactQuill
              theme="snow"
              value={answer}
              onChange={setAnswer}
            />

            <Button
              onClick={handleAddFAQ}
              disabled={faqSaving}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {faqSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add FAQ
            </Button>
          </div>

          {faqLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          ) : (
            faqs.map((faq: any) => (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-slate-100">
                  {faq.question}
                </p>

                <div
                  className="mt-2 text-sm text-slate-400 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ================= POLICY ================= */}
      <Card className="bg-slate-900 border border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Policy Management
              </CardTitle>

              <CardDescription className="text-slate-400">
                Create or update policies
              </CardDescription>
            </div>

            <Badge className="bg-emerald-900/40 text-emerald-400">
              {policies.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <select
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value)}
              className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm"
            >
              <option value="PRIVACY_POLICY">Privacy Policy</option>
              <option value="TERMS_AND_CONDITIONS">Terms & Conditions</option>
            </select>

            <Input
              placeholder="Policy title"
              value={policyTitle}
              onChange={(e) => setPolicyTitle(e.target.value)}
              className="bg-slate-900 border-slate-700"
            />

            <ReactQuill
              theme="snow"
              value={policyContent}
              onChange={setPolicyContent}
            />

            <Button
              onClick={handleSavePolicy}
              disabled={policySaving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {policySaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Save Policy
            </Button>
          </div>

          {policyLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
          ) : (
            policies.map((policy: any) => (
              <div
                key={policy.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-100">
                    {policy.title}
                  </p>

                  <Badge
                    variant="outline"
                    className="border-slate-700 text-xs"
                  >
                    {policy.type}
                  </Badge>
                </div>

                <div
                  className="mt-3 text-sm text-slate-400 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}