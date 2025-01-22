import MatchupComparison from "@/components/MatchupComparison";
import MatchupsTable from "@/components/MatchupsTable";
import { Matchup } from "@/types/matchups";

const mockData: Matchup[] = [
  {"week":22,"name":"被詛咒了","stats":{"FG%":".442","FT%":".808","3PTM":"93","PTS":"692","REB":"252","AST":"243","ST":"60","BLK":"34","TO":"100"}},
  {"week":22,"name":"莫瑞我的愛將","stats":{"FG%":".470","FT%":".761","3PTM":"94","PTS":"821","REB":"314","AST":"213","ST":"37","BLK":"35","TO":"111"}},
  {"week":22,"name":"我的小火龍會噴水","stats":{"FG%":".535","FT%":".689","3PTM":"43","PTS":"554","REB":"254","AST":"171","ST":"39","BLK":"38","TO":"62"}},
  {"week":22,"name":"瑪卡巴卡","stats":{"FG%":".452","FT%":".817","3PTM":"80","PTS":"682","REB":"242","AST":"182","ST":"54","BLK":"30","TO":"83"}},
  {"week":22,"name":"領域展開『無量空処』","stats":{"FG%":".496","FT%":".828","3PTM":"77","PTS":"736","REB":"214","AST":"126","ST":"50","BLK":"30","TO":"76"}},
  {"week":22,"name":"Jaketw","stats":{"FG%":".489","FT%":".723","3PTM":"70","PTS":"683","REB":"296","AST":"181","ST":"42","BLK":"28","TO":"94"}},
  {"week":22,"name":"可不可以不要這麼紅","stats":{"FG%":".528","FT%":".701","3PTM":"63","PTS":"678","REB":"230","AST":"141","ST":"48","BLK":"23","TO":"64"}},
  {"week":22,"name":"無敵風火輪","stats":{"FG%":".489","FT%":".851","3PTM":"92","PTS":"951","REB":"323","AST":"176","ST":"32","BLK":"32","TO":"72"}},
  {"week":22,"name":"LIC醫龍 咒力反噬","stats":{"FG%":".524","FT%":".812","3PTM":"90","PTS":"739","REB":"273","AST":"132","ST":"37","BLK":"33","TO":"75"}},
  {"week":22,"name":"醫者仁心你卻讓我傷心","stats":{"FG%":".467","FT%":".772","3PTM":"58","PTS":"657","REB":"287","AST":"201","ST":"33","BLK":"25","TO":"67"}},
  {"week":22,"name":"到底要多會受傷？","stats":{"FG%":".419","FT%":".810","3PTM":"65","PTS":"440","REB":"155","AST":"122","ST":"24","BLK":"27","TO":"64"}},
  {"week":22,"name":"来找朋友的","stats":{"FG%":".438","FT%":".864","3PTM":"68","PTS":"542","REB":"154","AST":"84","ST":"25","BLK":"12","TO":"55"}}
];

export default function DemoPage() {
  const columns = ["FG%", "FT%", "3PTM", "PTS", "REB", "AST", "ST", "BLK", "TO"];

  return (
    <main className="min-h-screen pixel-bg">
      <div className="font-[family-name:var(--font-press-start)] container mx-auto pt-20 pb-32 px-4">
        <h1 className="text-xl mb-12 text-yellow-300 pixel-text text-center">
          Demo
        </h1>

        {/* 功能說明 */}
        <div className="mb-12 text-center">
          <p className="text-slate-200 text-sm pixel-text mb-4">
            This is a demo page using mock data to showcase the Matchups feature:
          </p>
          <ul className="text-slate-300 text-sm pixel-text space-y-2">
            <li>
              <span className="text-yellow-300">Top Table: </span>
              Shows all teams&apos; stats with color gradients indicating performance
            </li>
            <li>
              <span className="text-yellow-300">Bottom Table: </span>
              Interactive comparison tool to analyze stats differences between teams
            </li>
            <li>
              <span className="text-yellow-300">Color Scale: </span>
              Green = better, Red = worse (reversed for TO)
            </li>
          </ul>
        </div>

        <MatchupsTable data={mockData} columns={columns} />

        <div className="mt-12">
          <MatchupComparison 
            matchupsData={mockData} 
            columns={columns} 
          />
        </div>
      </div>
    </main>
  );
} 