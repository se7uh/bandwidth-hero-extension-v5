import { RULES_MIGRATION_VERSION, type Rule } from "./rules/types"

export interface Statistics {
	filesProcessed: number
	bytesProcessed: number
	bytesSaved: number
}

export type ImageFormat = "webp" | "jpeg" | "avif"

export interface State {
	enabled: boolean
	statistics: Statistics
	disabledHosts: string[]
	invertBlocklist: boolean
	rules: Rule[]
	rulesMigrationVersion: number
	convertBw: boolean
	compressionLevel: number
	proxyUrl: string
	isWebpSupported: boolean
	colorScheme: "light" | "dark"
	imageFormat: ImageFormat
}

const defaultState: State = {
	enabled: true,
	statistics: {
		filesProcessed: 0,
		bytesProcessed: 0,
		bytesSaved: 0,
	},
	disabledHosts: [],
	invertBlocklist: false,
	rules: [],
	rulesMigrationVersion: RULES_MIGRATION_VERSION,
	convertBw: false,
	compressionLevel: 40,
	proxyUrl: "",
	isWebpSupported: true,
	colorScheme: "light",
	imageFormat: "webp",
}

export default defaultState
