import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Key, Copy, Check, ChevronLeft } from 'lucide-react'
import { PlatformBadge } from '@/components/PlatformBadge'

type Product = {
  id: number
  name: string
  platform: { name: string }
  quantity?: number
}

type KeyItem = {
  id: number
  game: string
  platform: string
  key: string
  purchaseDate: string
}

export default function KeysPage() {
  const [keys, setKeys] = useState<KeyItem[]>([])
  const [revealedKeys, setRevealedKeys] = useState<number[]>([])
  const [copiedKey, setCopiedKey] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const dataStr = sessionStorage.getItem('keysPageData')
    if (!dataStr) {
      navigate({ to: '/account/purchases' })
      return
    }

    const data = JSON.parse(dataStr) as {
      orderId: number
      products: Product[]
      date: string
    }

    const generateKey = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      return Array.from({ length: 4 }, () =>
        Array.from({ length: 4 }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      ).join('-')
    }

    const generatedKeys: KeyItem[] = []
    data.products.forEach((product) => {
      const count = product.quantity ?? 1
      for (let i = 0; i < count; i++) {
        generatedKeys.push({
          id: generatedKeys.length + 1,
          game:
            count > 1
              ? `${product.name} (${i + 1} z ${count})`
              : product.name,
          platform: product.platform?.name ?? 'Nieznana',
          key: generateKey(),
          purchaseDate: new Date(data.date).toLocaleDateString('pl-PL'),
        })
      }
    })

    setKeys(generatedKeys)
  }, [navigate])

  const toggleKeyReveal = (id: number) =>
    setRevealedKeys(prev =>
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    )

  const copyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (!keys.length) return null

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-4xl space-y-8">
        <Button
            onClick={() => navigate({to: '/account/purchases'})}
            variant="outline"
            className="bg-[#D4A44A] border-[#D4A44A] hover:bg-[#B8873D] text-sm sm:text-base mb-14"
            >
            <ChevronLeft className="h-4 w-4 mr-2 mt-0.25 font-bold" />
            Zamówienia
        </Button>
        <div className="grid gap-5">
          {keys.map((keyData) => (
            <Card
              key={keyData.id}
              className="bg-[#1F1F1F] border-[#3A3A3A] overflow-hidden hover:border-[#D4A44A]/50 transition-all shadow-md"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-[#2A2A2A] p-3 rounded-lg h-16 w-16">
                    <Key className="h-7 w-7 text-[#D4A44A]" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {keyData.game}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <PlatformBadge platform={keyData.platform} />
                      <span className="text-xs sm:text-sm text-gray-400">
                        Zakupiono: {keyData.purchaseDate}
                      </span>
                    </div>

                    <div className="bg-[#2A2A2A] p-3 rounded-lg border border-[#3A3A3A] relative overflow-hidden">
                      {!revealedKeys.includes(keyData.id) && (
                        <div className="absolute inset-0 backdrop-blur-sm bg-[#2A2A2A]/90 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="bg-[#D4A44A] text-black hover:bg-[#B8873D] w-full"
                            onClick={() => toggleKeyReveal(keyData.id)}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Pokaż klucz
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <code className="text-[#D4A44A] font-mono text-sm sm:text-base font-bold">
                          {revealedKeys.includes(keyData.id)
                            ? keyData.key
                            : 'XXXX-XXXX-XXXX-XXXX'}
                        </code>
                        {revealedKeys.includes(keyData.id) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#D4A44A] hover:bg-[#3A3A3A]"
                            onClick={() => copyKey(keyData.id, keyData.key)}
                          >
                            {copiedKey === keyData.id ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Skopiowano!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1" />
                                Kopiuj
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
