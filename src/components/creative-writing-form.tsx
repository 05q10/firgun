"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  grade: z.string().min(1, { message: "Please select a grade level" }),
  writingStyle: z.string().min(1, { message: "Please select a writing style" }),
  wordLimit: z.string().min(1, { message: "Please enter a word limit" }),
  // Narrative fields
  setting: z.string().optional(),
  characters: z.string().optional(),
  theme: z.string().optional(),
  // Argumentative fields
  topic: z.string().optional(),
  // Essay fields
  essayTopic: z.string().optional(),
  // Report fields
  reportSubject: z.string().optional(),
  // Journal fields
  journalPrompt: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreativeWritingForm() {
  const [step, setStep] = useState(1)
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: "",
      writingStyle: "",
      wordLimit: "",
      setting: "",
      characters: "",
      theme: "",
      topic: "",
      essayTopic: "",
      reportSubject: "",
      journalPrompt: "",
    },
  })

  const writingStyle = form.watch("writingStyle")

  const handleNext = () => {
    if (step === 1) {
      form.trigger(["grade", "writingStyle"])
      if (form.formState.errors.grade || form.formState.errors.writingStyle) {
        return
      }
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true)

    // Generate the prompt based on the form values
    let prompt = `Create a ${values.writingStyle} for a ${values.grade} student with a word limit of ${values.wordLimit} words.`

    switch (values.writingStyle) {
      case "narrative":
        prompt += ` The narrative should be set in "${values.setting}", include characters like "${values.characters}", and explore the theme of "${values.theme}".`
        break
      case "argumentative":
        prompt += ` The argumentative piece should address the topic: "${values.topic}".`
        break
      case "essay":
        prompt += ` The essay should be about: "${values.essayTopic}".`
        break
      case "report":
        prompt += ` The report should cover the subject: "${values.reportSubject}".`
        break
      case "journal":
        prompt += ` The journal entry should respond to the prompt: "${values.journalPrompt}".`
        break
    }

    prompt += ` Please provide a well-structured ${values.writingStyle} that demonstrates grade-appropriate vocabulary, grammar, and critical thinking skills. The response should be approximately ${values.wordLimit} words.`

    // Simulate a delay to represent API call
    setTimeout(() => {
      setGeneratedPrompt(prompt)
      setIsGenerating(false)
    }, 1000)
  }

  // Style variables for consistent coloring
  const styles = {
    cardBg: "bg-gradient-to-br from-yellow-50 to-teal-50", 
    inputBg: "bg-yellow-50 focus:bg-yellow-100 transition-colors duration-300",
    textareaBg: "bg-teal-50 focus:bg-teal-100 transition-colors duration-300",
    radioBg: "bg-yellow-100",
    resultBg: "bg-gradient-to-r from-teal-50 to-yellow-50 border border-teal-200",
    stepIndicator: "text-teal-600 font-medium",
    button: "bg-teal-500 hover:bg-teal-600 text-white",
    outlineButton: "border-teal-300 text-teal-600 hover:bg-teal-50"
  }

  return (
    <Card className={`w-full ${styles.cardBg} shadow-lg border-teal-100`}>
      <CardContent className="pt-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-teal-700">Creative Writing Prompt Generator</h2>
          <p className="text-teal-600">Step {step} of 3</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className={`${styles.stepIndicator} text-lg`}>Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-700">Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={`${styles.inputBg} border-yellow-200`}>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="elementary (1-5)">Elementary (Grades 1-5)</SelectItem>
                          <SelectItem value="middle school (6-8)">Middle School (Grades 6-8)</SelectItem>
                          <SelectItem value="high school (9-12)">High School (Grades 9-12)</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="writingStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-700">Writing Style</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="narrative" className="border-teal-400 text-teal-600" />
                            </FormControl>
                            <FormLabel className="font-normal">Narrative</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="argumentative" className="border-teal-400 text-teal-600" />
                            </FormControl>
                            <FormLabel className="font-normal">Argumentative</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="essay" className="border-teal-400 text-teal-600" />
                            </FormControl>
                            <FormLabel className="font-normal">Essay</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="report" className="border-teal-400 text-teal-600" />
                            </FormControl>
                            <FormLabel className="font-normal">Report</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="journal" className="border-teal-400 text-teal-600" />
                            </FormControl>
                            <FormLabel className="font-normal">Journal</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" onClick={handleNext} className={styles.button}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className={`${styles.stepIndicator} text-lg`}>Content Details</h3>
                
                {writingStyle === "narrative" && (
                  <>
                    <FormField
                      control={form.control}
                      name="setting"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-700">Setting</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Describe the setting (e.g., medieval castle, future city)" 
                              {...field} 
                              className={`${styles.inputBg} border-yellow-200`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="characters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-700">Characters</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Describe the main characters" 
                              {...field} 
                              className={`${styles.inputBg} border-yellow-200`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-700">Theme</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="What's the main theme? (e.g., friendship, courage)" 
                              {...field} 
                              className={`${styles.inputBg} border-yellow-200`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {writingStyle === "argumentative" && (
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-700">Topic</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What topic are you arguing about?"
                            className={`min-h-[100px] ${styles.textareaBg} border-teal-200`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {writingStyle === "essay" && (
                  <FormField
                    control={form.control}
                    name="essayTopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-700">Essay Topic</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is your essay about?" 
                            className={`min-h-[100px] ${styles.textareaBg} border-teal-200`} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {writingStyle === "report" && (
                  <FormField
                    control={form.control}
                    name="reportSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-700">Report Subject</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is your report about?" 
                            className={`min-h-[100px] ${styles.textareaBg} border-teal-200`} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {writingStyle === "journal" && (
                  <FormField
                    control={form.control}
                    name="journalPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-700">Journal Prompt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is the journal prompt?" 
                            className={`min-h-[100px] ${styles.textareaBg} border-teal-200`} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="wordLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-700">Word Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter word limit" 
                          {...field} 
                          className={`${styles.inputBg} border-yellow-200`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack} 
                    className={styles.outlineButton}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={handleNext} className={styles.button}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className={`${styles.stepIndicator} text-lg`}>Review and Generate</h3>
                <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200 shadow-sm">
                  <p className="mb-2 text-teal-700 font-semibold">Your Writing Prompt Details:</p>
                  <p>
                    <strong>Grade Level:</strong> {form.getValues("grade")}
                  </p>
                  <p>
                    <strong>Writing Style:</strong> {form.getValues("writingStyle")}
                  </p>
                  <p>
                    <strong>Word Limit:</strong> {form.getValues("wordLimit")}
                  </p>

                  {writingStyle === "narrative" && (
                    <>
                      <p>
                        <strong>Setting:</strong> {form.getValues("setting")}
                      </p>
                      <p>
                        <strong>Characters:</strong> {form.getValues("characters")}
                      </p>
                      <p>
                        <strong>Theme:</strong> {form.getValues("theme")}
                      </p>
                    </>
                  )}

                  {writingStyle === "argumentative" && (
                    <p>
                      <strong>Topic:</strong> {form.getValues("topic")}
                    </p>
                  )}

                  {writingStyle === "essay" && (
                    <p>
                      <strong>Essay Topic:</strong> {form.getValues("essayTopic")}
                    </p>
                  )}

                  {writingStyle === "report" && (
                    <p>
                      <strong>Report Subject:</strong> {form.getValues("reportSubject")}
                    </p>
                  )}

                  {writingStyle === "journal" && (
                    <p>
                      <strong>Journal Prompt:</strong> {form.getValues("journalPrompt")}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBack} 
                    className={styles.outlineButton}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isGenerating} className={styles.button}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Prompt"
                    )}
                  </Button>
                </div>

                {generatedPrompt && (
                  <div className="mt-6 animate-fadeIn">
                    <h3 className="text-lg font-medium mb-2 text-teal-700">Your Creative Prompt</h3>
                    <div className={`rounded-md p-6 ${styles.resultBg} shadow-md`}>
                      <p className="whitespace-pre-wrap text-teal-800">{generatedPrompt}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPrompt)
                        }}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800"
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}