"use client"

import { Box, Container } from "@mui/material"

import Header from "../components/Header"
import RankingTable from "../components/RankingTable"
import TotalPointChart from "../components/TotalPointChart"
import { Item, RankItem } from "../types"

export type RankingViewProps = {
  items: Item[]
  rankItems: RankItem[]
}

const RankingView: React.FC<RankingViewProps> = (props) => {
  const { items, rankItems } = props

  return (
    <div>
      <Header />

      <Container>
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
          }}
        >
          <TotalPointChart items={items.slice(0, 7)} />
        </Box>

        <Box>
          <RankingTable rankItems={rankItems} />
        </Box>
      </Container>
    </div>
  )
}

export default RankingView
