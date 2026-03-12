import { listFollowUps } from "@/actions/follow-ups"
import { listCustomers } from "@/actions/customers"
import { FollowUpList } from "@/components/follow-ups/follow-up-list"

export default async function FollowUpsPage() {
  const [overdue, today, upcoming, customers] = await Promise.all([
    listFollowUps({ date: "overdue" }),
    listFollowUps({ date: "today" }),
    listFollowUps({ date: "upcoming" }),
    listCustomers(),
  ])

  return (
    <div className="space-y-6">
      <FollowUpList
        overdue={overdue}
        today={today}
        upcoming={upcoming}
        customers={customers}
      />
    </div>
  )
}
