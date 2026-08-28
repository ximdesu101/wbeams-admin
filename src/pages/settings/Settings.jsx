import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Wrench } from 'lucide-react';
import SiteSetting from "./layouts/SiteSetting";
import SessionSetting from "./layouts/SessionSetting";
import ThemeIcon from "@/components/styles/theme/ThemeIcon"
import ThemeSwitch from "@/components/styles/theme/ThemeSwitch"
import ThemeText from "@/components/styles/theme/ThemeText"
import useDocumentTitle from "@/hooks/useDocumentTitle"

const Settings = () => {
    useDocumentTitle("NwSSU Alerts | Settings")
    return (
        <>
            <div className="w-full flex gap-4">
                <div className="flex-1">
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between">
                            <div className="flex gap-1 p-0">
                                <div className="my-auto"><Wrench className="w-4 h-4"/></div>
                                <Label>Enable System Maintenance</Label>
                            </div>
                            <Switch />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1">
                    <Card>
                        <CardContent className="flex flex-row items-center justify-between">
                            <div className="flex gap-1 p-0">
                                <div className="my-auto"><ThemeIcon /></div>
                                <ThemeText />
                            </div>
                            <ThemeSwitch />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="w-full flex gap-4">
                <SiteSetting />
                <SessionSetting />
            </div>
        </>
    )
}

export default Settings