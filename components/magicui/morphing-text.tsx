"use client"

import {
	type RefObject,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react"

import {cn} from "@/lib/utils"

const morphTime = 1.5
const cooldownTime = 2.5

const useMorphingText = ({
	texts,
	cycle = false,
}: {
	texts: string[]
	cycle?: boolean
}) => {
	const textIndexRef = useRef(0)
	const morphRef = useRef(0)
	const cooldownRef = useRef(0)
	const timeRef = useRef(new Date())

	const text1Ref = useRef<HTMLSpanElement>(null)
	const text2Ref = useRef<HTMLSpanElement>(null)

	const setStyles = useCallback(
		(fraction: number) => {
			const [current1, current2] = [text1Ref.current, text2Ref.current]
			if (!current1 || !current2) return

			current2.style.filter = `blur(${Math.min(2 / fraction - 2, 100)}px)`
			current2.style.opacity = `${fraction ** 0.4 * 100}%`

			const invertedFraction = 1 - fraction
			current1.style.filter = `blur(${Math.min(
				2 / invertedFraction - 2,
				100,
			)}px)`
			current1.style.opacity = `${invertedFraction ** 0.4 * 100}%`

			current1.textContent = texts[textIndexRef.current % texts.length]
			current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
		},
		[texts],
	)

	const doMorph = useCallback(() => {
		morphRef.current -= cooldownRef.current
		cooldownRef.current = 0

		let fraction = morphRef.current / morphTime

		if (fraction > 1) {
			cooldownRef.current = cooldownTime
			fraction = 1
		}

		setStyles(fraction)

		if (fraction === 1) {
			textIndexRef.current++
		}
	}, [setStyles])

	const doCooldown = useCallback(() => {
		morphRef.current = 0
		const [current1, current2] = [text1Ref.current, text2Ref.current]
		if (current1 && current2) {
			current2.style.filter = "none"
			current2.style.opacity = "100%"
			current1.style.filter = "none"
			current1.style.opacity = "0%"
		}
	}, [])

	const animate = () => {
		console.log("animate")

		const newTime = new Date()
		const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
		timeRef.current = newTime

		// console.log("dt", dt)
		// console.log("z", z)

		cooldownRef.current -= dt

		if (cooldownRef.current <= 0) {
			requestAnimationFrame(animate)
			doMorph()
		} else {
			doCooldown()
		}
	}

	useEffect(() => {
		console.log("useEffect", cycle)
		if (cycle) return
		animate()
	}, [cycle])

	useEffect(() => {
		if (!cycle) return

		let animationFrameId: number

		const animate = () => {
			animationFrameId = requestAnimationFrame(animate)

			const newTime = new Date()
			const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
			timeRef.current = newTime

			cooldownRef.current -= dt

			if (cooldownRef.current <= 0) doMorph()
			else doCooldown()
		}

		animate()
		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, [cycle, doMorph, doCooldown])

	return {text1Ref, text2Ref, animate}
}

interface MorphingTextProps {
	className?: string
	texts: string[]
	cycle?: boolean
	ref?: RefObject<{animate: () => void} | null>
}

const Texts: React.FC<Pick<MorphingTextProps, "texts" | "cycle">> = ({
	texts,
	cycle,
}) => {
	const {text1Ref, text2Ref} = useMorphingText({texts, cycle})
	return (
		<>
			<span
				className="absolute inset-x-0 top-0 m-auto inline-block w-full"
				ref={text1Ref}
			/>
			<span
				className="absolute inset-x-0 top-0 m-auto inline-block w-full"
				ref={text2Ref}
			/>
		</>
	)
}

const SvgFilters: React.FC = () => (
	<svg
		id="filters"
		className="fixed h-0 w-0"
		preserveAspectRatio="xMidYMid slice"
	>
		<defs>
			<filter id="threshold">
				<feColorMatrix
					in="SourceGraphic"
					type="matrix"
					values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
				/>
			</filter>
		</defs>
	</svg>
)

export const MorphingText: React.FC<MorphingTextProps> = ({
	texts,
	cycle,
	className,
	ref,
}) => {
	const {animate} = useMorphingText({texts, cycle})

	useImperativeHandle(ref, () => ({
		animate,
	}))

	return (
		<div
			className={cn(
				"relative font-sans font-bold leading-none [filter:url(#threshold)_blur(0.6px)] ",
				className,
			)}
		>
			<Texts texts={texts} cycle={cycle} />
			<SvgFilters />
		</div>
	)
}
