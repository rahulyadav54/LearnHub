import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trophy, Shield, Star, Lock } from 'lucide-react'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all achievements
  const { data: allAchievements } = await supabase
    .from('achievements')
    .select('*')
    .order('points', { ascending: true })

  // Fetch user's unlocked achievements
  const { data: unlockedData } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user?.id)

  const unlockedIds = new Set(unlockedData?.map(u => u.achievement_id))

  const totalPoints = allAchievements?.reduce((acc, curr) => {
    if (unlockedIds.has(curr.id)) return acc + curr.points
    return acc
  }, 0) || 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" /> Achievements
          </h1>
          <p className="text-muted-foreground mt-2">Unlock badges by learning and practicing consistently.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-primary">{totalPoints}</div>
          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Points</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements && allAchievements.map((achieve) => {
          const isUnlocked = unlockedIds.has(achieve.id)
          
          return (
            <Card key={achieve.id} className={isUnlocked ? 'border-primary/50 bg-primary/5' : 'opacity-60 grayscale'}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {isUnlocked ? <Star className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <div>
                  <CardTitle className="text-lg">{achieve.title}</CardTitle>
                  <CardDescription className="text-xs font-bold text-primary mt-1">{achieve.points} Points</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{achieve.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
