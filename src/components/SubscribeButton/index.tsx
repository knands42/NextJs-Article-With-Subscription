import { signIn, useSession } from 'next-auth/client'

import { getStripeJs } from '@/services/stripe-js'
import { api } from '@/services/api'

import style from './style.module.scss'

type SubscribeButtonProps = {
  priceId: string
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  priceId
}) => {
  const [session] = useSession()

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()
      await stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button
      type="button"
      className={style.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}