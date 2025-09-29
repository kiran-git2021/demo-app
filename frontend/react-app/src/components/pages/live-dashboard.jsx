import {ChartAreaInteractive} from "@/components/charts/area-chart.jsx";
import {ChartBarInteractive} from "@/components/charts/bar-chart";
import {ChartPieDonut} from "@/components/charts/donut.jsx";
import {ChartLineInteractive} from "@/components/charts/line-chart.jsx";
import {StatsGridIcons} from "@/components/charts/StatsGridIcons.jsx";

// import StatsSegments from "@/components/charts/summary-chart.jsx";

export default function LiveDashboard() {
  return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                  <div className="bg-muted/50 aspect-video rounded-xl"><ChartPieDonut/></div>
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons /></div>
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>
                  {/*<div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>*/}
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>
                  {/*<div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>*/}
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>
                  <div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>
                  {/*<div className="bg-muted/50 aspect-video rounded-xl"><StatsGridIcons/></div>*/}
              </div>
          </div>
          {/*<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />*/}
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <ChartBarInteractive/>
          <ChartLineInteractive/>
              </div>
          <ChartAreaInteractive/>
          <ChartLineInteractive/>
          <ChartBarInteractive/>


      </div>

  )
}
