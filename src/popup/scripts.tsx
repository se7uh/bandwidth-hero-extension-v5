import { Globe, Home as HomeIcon, Settings as SettingsIcon } from "lucide-react"
import React from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import Header from "../components/Header"
import Home from "../components/Home"
import Settings from "../components/Settings"
import type { ImageFormat } from "../defaults"
import defaults from "../defaults"
import parseUrl from "../utils/parseUrl"

type ActiveTab = "home" | "sites" | "settings"

interface PopupState {
	enabled: boolean
	statistics: {
		filesProcessed: number
		bytesProcessed: number
		bytesSaved: number
	}
	disabledHosts: string[]
	convertBw: boolean
	compressionLevel: number
	isWebpSupported: boolean
	proxyUrl: string
	imageFormat: ImageFormat
	activeTab: ActiveTab
}

class Popup extends React.Component<{ currentUrl: string }, PopupState> {
	constructor(props: { currentUrl: string }) {
		super(props)
		this.state = {
			enabled: true,
			statistics: { filesProcessed: 0, bytesProcessed: 0, bytesSaved: 0 },
			disabledHosts: [],
			convertBw: false,
			compressionLevel: 40,
			isWebpSupported: true,
			proxyUrl: "",
			imageFormat: "webp",
			activeTab: "home",
		}
	}

	componentDidMount() {
		chrome.storage.local.get(null, (stored: Partial<PopupState>) => {
			this.setState({
				enabled: stored.enabled ?? defaults.enabled,
				statistics: stored.statistics ?? defaults.statistics,
				disabledHosts: stored.disabledHosts ?? defaults.disabledHosts,
				convertBw: stored.convertBw ?? defaults.convertBw,
				compressionLevel: stored.compressionLevel ?? defaults.compressionLevel,
				isWebpSupported: stored.isWebpSupported ?? true,
				proxyUrl: stored.proxyUrl ?? defaults.proxyUrl,
				imageFormat: stored.imageFormat ?? defaults.imageFormat,
			})
		})
		chrome.storage.onChanged.addListener(this.stateWasUpdatedFromBackground)
	}

	componentWillUnmount() {
		chrome.storage.onChanged.removeListener(this.stateWasUpdatedFromBackground)
	}

	enableSwitchWasChanged = () => {
		this.setState((prevState) => {
			const enabled = !prevState.enabled
			chrome.storage.local.set({ enabled })
			return { enabled }
		})
	}

	siteWasDisabled = () => {
		const { hostname } = parseUrl(this.props.currentUrl)
		this.setState((prevState) => {
			const disabledHosts = [...prevState.disabledHosts, hostname]
			chrome.storage.local.set({ disabledHosts })
			return { disabledHosts }
		})
	}

	siteWasEnabled = () => {
		const { hostname } = parseUrl(this.props.currentUrl)
		this.setState((prevState) => {
			const disabledHosts = prevState.disabledHosts.filter(
				(site) => site !== hostname,
			)
			chrome.storage.local.set({ disabledHosts })
			return { disabledHosts }
		})
	}

	disabledHostsWasChanged = (value: string) => {
		const disabledHosts = value
			.split("\n")
			.map((h) => h.trim())
			.filter((host) => host !== "")
		chrome.storage.local.set({ disabledHosts })
		this.setState({ disabledHosts })
	}

	convertBwWasChanged = () => {
		this.setState((prevState) => {
			const convertBw = !prevState.convertBw
			chrome.storage.local.set({ convertBw })
			return { convertBw }
		})
	}

	compressionLevelWasChanged = (value: number) => {
		chrome.storage.local.set({ compressionLevel: value })
		this.setState({ compressionLevel: value })
	}

	proxyUrlWasChanged = (proxyUrl: string) => {
		chrome.storage.local.set({ proxyUrl })
		this.setState({ proxyUrl })
	}

	imageFormatWasChanged = (imageFormat: ImageFormat) => {
		chrome.storage.local.set({ imageFormat })
		this.setState({ imageFormat })
	}

	stateWasUpdatedFromBackground = (changes: {
		[key: string]: chrome.storage.StorageChange
	}) => {
		const changedItems = Object.keys(changes)
		for (const item of changedItems) {
			if (this.state[item as keyof PopupState] !== changes[item].newValue) {
				this.setState({ [item]: changes[item].newValue } as Pick<
					PopupState,
					keyof PopupState
				>)
			}
		}
	}

	render() {
		const { activeTab } = this.state

		return (
			<div className="flex min-h-115 w-95 flex-col bg-brut-yellow outline-[3px] outline-black">
				{/* Header */}
				<Header
					enabled={this.state.enabled}
					onChange={this.enableSwitchWasChanged}
				/>

				{/* Content */}
				<div className="flex-1 overflow-y-auto bg-brut-yellow p-4">
					{activeTab === "home" && (
						<Home
							view="home"
							statistics={this.state.statistics}
							disabledHosts={this.state.disabledHosts}
							currentUrl={this.props.currentUrl}
							compressionLevel={this.state.compressionLevel}
							convertBw={this.state.convertBw}
							imageFormat={this.state.imageFormat}
							proxyUrl={this.state.proxyUrl}
							onSiteDisable={this.siteWasDisabled}
							onSiteEnable={this.siteWasEnabled}
							compressionLevelOnChange={this.compressionLevelWasChanged}
							convertBwOnChange={this.convertBwWasChanged}
							imageFormatOnChange={this.imageFormatWasChanged}
							onConfigureProxy={() => this.setState({ activeTab: "settings" })}
						/>
					)}
					{activeTab === "sites" && (
						<Home
							view="sites"
							statistics={this.state.statistics}
							disabledHosts={this.state.disabledHosts}
							currentUrl={this.props.currentUrl}
							compressionLevel={this.state.compressionLevel}
							convertBw={this.state.convertBw}
							imageFormat={this.state.imageFormat}
							proxyUrl={this.state.proxyUrl}
							onSiteDisable={this.siteWasDisabled}
							onSiteEnable={this.siteWasEnabled}
							disabledOnChange={this.disabledHostsWasChanged}
							compressionLevelOnChange={this.compressionLevelWasChanged}
							convertBwOnChange={this.convertBwWasChanged}
							imageFormatOnChange={this.imageFormatWasChanged}
							onConfigureProxy={() => this.setState({ activeTab: "settings" })}
						/>
					)}
					{activeTab === "settings" && (
						<Settings
							proxyUrl={this.state.proxyUrl}
							onChange={this.proxyUrlWasChanged}
							onBack={() => this.setState({ activeTab: "home" })}
						/>
					)}
				</div>

				{/* Tab bar */}
				<div className="flex border-black border-t-[3px] bg-white">
					<button
						type="button"
						onClick={() => this.setState({ activeTab: "home" })}
						className={`flex flex-1 cursor-pointer items-center justify-center border-black border-r-[3px] border-none p-4 ${activeTab === "home" ? "bg-brut-cyan" : "bg-white"}`}
					>
						<HomeIcon size={24} strokeWidth={3} />
					</button>
					<button
						type="button"
						onClick={() => this.setState({ activeTab: "sites" })}
						className={`flex flex-1 cursor-pointer items-center justify-center border-black border-r-[3px] border-none p-4 ${activeTab === "sites" ? "bg-brut-cyan" : "bg-white"}`}
					>
						<Globe size={24} strokeWidth={3} />
					</button>
					<button
						type="button"
						onClick={() => this.setState({ activeTab: "settings" })}
						className={`flex flex-1 cursor-pointer items-center justify-center border-none p-4 ${activeTab === "settings" ? "bg-brut-cyan" : "bg-white"}`}
					>
						<SettingsIcon size={24} strokeWidth={3} />
					</button>
				</div>
			</div>
		)
	}
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const currentUrl = tabs[0]?.url || ""
	const container = document.getElementById("root")
	if (container) {
		const root = createRoot(container)
		root.render(<Popup currentUrl={currentUrl} />)
	}
})
