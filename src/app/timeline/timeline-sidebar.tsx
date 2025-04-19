"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Calendar, Info } from "lucide-react"
import type { TimelineEvent } from "@/lib/types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TimelineSidebarProps {
  timelineEvents: TimelineEvent[]
  selectedYear: number
  onYearChange: (year: number) => void
}

export default function TimelineSidebar({ timelineEvents, selectedYear, onYearChange }: TimelineSidebarProps) {
  // Group events by year
  const eventsByYear = timelineEvents.reduce(
    (acc, event) => {
      if (!acc[event.year]) {
        acc[event.year] = []
      }
      acc[event.year].push(event)
      return acc
    },
    {} as Record<number, TimelineEvent[]>,
  )

  // Get sorted years
  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <Sidebar variant="floating" className="border-r-2 border-black dark:border-gray-700">
      <SidebarHeader className="border-b-2 border-black dark:border-gray-700 bg-yellow-200 dark:bg-gray-800">
        <div className="p-4">
          <h2 className="text-2xl font-bold comic-title">MCU Timeline</h2>
          <p className="text-sm">Explore events year by year</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-yellow-50 dark:bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-lg font-bold">
            <Calendar className="mr-2" />
            Timeline
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {years.map((year) => (
                <Collapsible key={year} defaultOpen={year === selectedYear}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={year === selectedYear}
                        onClick={() => onYearChange(year)}
                        className={cn(
                          "font-bold border-2 border-black dark:border-gray-700 mb-1",
                          year === selectedYear
                            ? "bg-red-500 text-white dark:bg-red-700"
                            : "bg-blue-100 dark:bg-gray-700",
                        )}
                      >
                        <span className="text-lg">{year}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 pl-4 border-l-4 border-dashed border-black dark:border-gray-600">
                        {eventsByYear[year].map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-3 p-3 bg-white dark:bg-gray-700 rounded-lg border-2 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(55,65,81,1)]"
                          >
                            <h3 className="font-bold text-md">{event.title}</h3>
                            <p className="text-sm mt-1">{event.description}</p>
                            {event.characters && (
                              <div className="mt-2 text-xs">
                                <span className="font-bold">Characters: </span>
                                {event.characters.join(", ")}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2 border-black dark:border-gray-700 bg-yellow-200 dark:bg-gray-800">
        <div className="p-4 flex items-center">
          <Info className="mr-2" size={16} />
          <span className="text-sm">Data from MCU Wiki</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
      <SidebarTrigger className="absolute top-4 right-4 z-50" />
    </Sidebar>
  )
}
