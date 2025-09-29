import {ThemeControlButton,ThemeControlDropDown} from '@/components/ui/mode-toggle-theme.jsx'

export default function Settings() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                <div className="bg-muted/0 aspect-video rounded-xl"/>
                <div className="bg-muted/0 aspect-video rounded-xl"/>
                <div className="bg-muted/0 aspect-video rounded-xl">
                    <h1>theme</h1>
                    <div className="flex gap-2">
                      <ThemeControlButton />
                      <ThemeControlDropDown />
                    </div>
                </div>
            </div>
            <div className="bg-muted/0 min-h-[100vh] flex-1 rounded-xl md:min-h-min"/>
        </div>

    )
}