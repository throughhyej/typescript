import axios, { AxiosResponse } from "axios";

// 2022.05.15 기준 ts에 적용할 수 있게 업데이트되어 있음
// import * as  Chart from 'chart.js';

import Chart from "chart.js"; // @^2.9.4 downgrade && npm i --save-dev @types/chart.js

// type 정의
import {
  Country,
  COVID_STATUS,
  CovidSummaryResponse,
  CountrySummeryResponse,
  CountrySummeryInfo,
} from "./def-types/index";

// utils
function $(selector: string) {
  return document.querySelector(selector);
}
function getUnixTimestamp(date: Date | string) {
  return new Date(date).getTime();
}

// DOM
const confirmedTotal = $(".confirmed-total") as HTMLElement;
const deathsTotal = $(".deaths") as HTMLElement;
const recoveredTotal = $(".recovered") as HTMLElement;
const lastUpdatedTime = $(".last-updated-time") as HTMLElement;
const rankList = $(".rank-list");
const deathsList = $(".deaths-list");
const recoveredList = $(".recovered-list");
const deathSpinner = createSpinnerElement("deaths-spinner");
const recoveredSpinner = createSpinnerElement("recovered-spinner");

function createSpinnerElement(id: string) {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.setAttribute("id", id);
  wrapperDiv.setAttribute(
    "class",
    "spinner-wrapper flex justify-center align-center"
  );
  const spinnerDiv = document.createElement("div");
  spinnerDiv.setAttribute("class", "ripple-spinner");
  spinnerDiv.appendChild(document.createElement("div"));
  spinnerDiv.appendChild(document.createElement("div"));
  wrapperDiv.appendChild(spinnerDiv);
  return wrapperDiv;
}

// state
let isDeathLoading = false;

// api
function fetchCovidSummary(): Promise<AxiosResponse<CovidSummaryResponse>> {
  const url = "https://api.covid19api.com/summary";
  return axios.get(url);
}

function fetchCountryInfo(
  countryCode: string | undefined,
  status: COVID_STATUS
): Promise<AxiosResponse<CountrySummeryResponse>> {
  // params: confirmed, recovered, deaths
  const url = `https://api.covid19api.com/country/${countryCode}/status/${status}`;
  return axios.get(url);
}

// methods
export function startApp() {
  setupData();
  initEvents();
}

// events
function initEvents() {
  if (!rankList) return false;
  rankList.addEventListener("click", handleListClick);
}

async function handleListClick(event: Event) {
  let selectedId;
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement
      ? event.target.parentElement.id
      : undefined;
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id;
  }
  if (isDeathLoading) {
    return;
  }
  clearDeathList();
  clearRecoveredList();
  startLoadingAnimation();
  isDeathLoading = true;
  // destructuring 문법 (deathResponse)
  const { data: deathResponse } = await fetchCountryInfo(
    selectedId,
    COVID_STATUS.DEATHS
  );
  // destructuring 문법 (recoveredResponse)
  const { data: recoveredResponse } = await fetchCountryInfo(
    selectedId,
    COVID_STATUS.RECOVERD
  );
  // destructuring 문법 (confirmedResponse)
  const { data: confirmedResponse } = await fetchCountryInfo(
    selectedId,
    COVID_STATUS.CONFIRMED
  );
  endLoadingAnimation();
  setDeathsList(deathResponse);
  setTotalDeathsByCountry(deathResponse);
  setRecoveredList(recoveredResponse);
  setTotalRecoveredByCountry(recoveredResponse);
  setChartData(confirmedResponse);
  isDeathLoading = false;
}

function setDeathsList(data: CountrySummeryResponse) {
  const sorted = data.sort(
    (a: CountrySummeryInfo, b: CountrySummeryInfo) =>
      getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  );
  sorted.forEach((value: CountrySummeryInfo) => {
    const li = document.createElement("li");
    li.setAttribute("class", "list-item-b flex align-center");
    const span = document.createElement("span");
    span.textContent = value.Cases.toString();
    span.setAttribute("class", "deaths");
    const p = document.createElement("p");
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    deathsList?.appendChild(li); // deathsList!.appendChild(li); // 비권장
  });
}

function clearDeathList() {
  if (!deathsList) return false;
  deathsList.innerHTML = "";
}

function setTotalDeathsByCountry(data: CountrySummeryResponse) {
  deathsTotal.innerText = data[0].Cases.toString();
}

function setRecoveredList(data: CountrySummeryResponse) {
  const sorted = data.sort(
    (a: CountrySummeryInfo, b: CountrySummeryInfo) =>
      getUnixTimestamp(b.Date) - getUnixTimestamp(a.Date)
  );
  sorted.forEach((value: CountrySummeryInfo) => {
    const li = document.createElement("li");
    li.setAttribute("class", "list-item-b flex align-center");
    const span = document.createElement("span");
    span.textContent = value.Cases.toString();
    span.setAttribute("class", "recovered");
    const p = document.createElement("p");
    p.textContent = new Date(value.Date).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    recoveredList?.appendChild(li); // optional chaning operator
  });
}

function clearRecoveredList() {
  if (!recoveredList) return false;
  recoveredList.innerHTML = "";
}

function setTotalRecoveredByCountry(data: CountrySummeryResponse) {
  recoveredTotal.innerText = data[0].Cases.toString();
}

function startLoadingAnimation() {
  deathsList?.appendChild(deathSpinner); // optional chaning operator
  recoveredList?.appendChild(recoveredSpinner); // optional chaning operator
}

function endLoadingAnimation() {
  deathsList?.removeChild(deathSpinner); // optional chaning operator
  recoveredList?.removeChild(recoveredSpinner); // optional chaning operator
}

async function setupData() {
  const { data } = await fetchCovidSummary();
  setTotalConfirmedNumber(data);
  setTotalDeathsByWorld(data);
  setTotalRecoveredByWorld(data);
  setCountryRanksByConfirmedCases(data);
  setLastUpdatedTimestamp(data);
}

function renderChart(data: number[], labels: string[]) {
  const ctx = ($("#lineChart") as HTMLCanvasElement).getContext("2d");
  Chart.defaults.color = "#f5eaea";
  // Chart.defaults.font.family = 'Exo 2';
  if (!ctx) return false;
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Confirmed for the last two weeks",
          backgroundColor: "#feb72b",
          borderColor: "#feb72b",
          data,
        },
      ],
    },
    options: {},
  });
}

function setChartData(data: CountrySummeryResponse) {
  const chartData = data
    .slice(-14)
    .map((value: CountrySummeryInfo) => value.Cases);
  const chartLabel = data
    .slice(-14)
    .map((value: CountrySummeryInfo) =>
      new Date(value.Date).toLocaleDateString().slice(5, -1)
    );
  renderChart(chartData, chartLabel);
}

function setTotalConfirmedNumber(data: CovidSummaryResponse) {
  confirmedTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalConfirmed),
    0
  ).toString();
}

function setTotalDeathsByWorld(data: CovidSummaryResponse) {
  deathsTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalDeaths),
    0
  ).toString();
}

function setTotalRecoveredByWorld(data: CovidSummaryResponse) {
  recoveredTotal.innerText = data.Countries.reduce(
    (total: number, current: Country) => (total += current.TotalRecovered),
    0
  ).toString();
}

function setCountryRanksByConfirmedCases(data: CovidSummaryResponse) {
  const sorted = data.Countries.sort(
    (a: Country, b: Country) => b.TotalConfirmed - a.TotalConfirmed
  );
  sorted.forEach((value: Country) => {
    const li = document.createElement("li");
    li.setAttribute("class", "list-item flex align-center");
    li.setAttribute("id", value.Slug);
    const span = document.createElement("span");
    span.textContent = value.TotalConfirmed.toString();
    span.setAttribute("class", "cases");
    const p = document.createElement("p");
    p.setAttribute("class", "country");
    p.textContent = value.Country;
    li.appendChild(span);
    li.appendChild(p);
    rankList?.appendChild(li);
  });
}

function setLastUpdatedTimestamp(data: CovidSummaryResponse) {
  lastUpdatedTime.innerText = new Date(data.Date).toLocaleString();
}

// startApp();
