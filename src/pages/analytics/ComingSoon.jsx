import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ComingSoon({
    title = 'Coming Soon',
    subtitle = 'Something amazing is brewing',
    description = "We're working hard to bring you something extraordinary. Stay tuned for updates.",
    statusMessage = "We're currently in development. Check back soon for the official launch.",
    onEmailSubmit,
}) {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.includes('@')) {
            setSubmitted(true)
            onEmailSubmit?.(email)
            setEmail('')
            setTimeout(() => setSubmitted(false), 3000)
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-2xl w-full text-center space-y-8">

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl font-semibold text-primary">
                        {subtitle}
                    </p>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {statusMessage}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-card text-foreground border-border"
                        required
                    />
                    <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                        {submitted ? '✓ Subscribed' : 'Notify Me'}
                    </Button>
                </form>

                <div className="text-muted-foreground pt-8 flex justify-center gap-2">
                    <p>Web-Based Emergency Alert and Notification Management System with Multi-Channel Delivery and Incident Analytics for NWSSU – San Jorge Campus</p>
                </div>

            </div>
        </div>
    )
}

export default ComingSoon