# Waaiers - WIP
Wind is one of the most defening factors in a bike race. It can turn boring flat routes, into wild unpredictable and entertaining races.
The most devestating wind in a race is the crosswind. Crosswinds rip races apart, causing Waaiers to form as riders spread across the road in an attempt to hide from the wind.

Waaiers is being developed as a predicative wind anaylsis tool, that analyses wind speed and direction, and applies that to the terrain of the race to determine were the impacts of the wind are the largest and Waaiers should form.
Waaiers will generate wind analysis for all races in the UCI World Tour and Pro Series, but also allow amauter riders to upload gpx files of their own routes to access the wind data.

<div align="center">
  <div>
    <img src="https://procyclinguk.com/wp-content/uploads/2020/07/Echelons-Paris-Nice-2012.jpg" title="hover text">
  </div>
  <p style="font-size:10px">
    The impact of crosswinds causing Waaiers to form at Paris-Nice 2012
  </p>
</div>

## Tech Stack
- React
- Vite
- Supabase
- PostgreSQL

## Current Progress
- Setup external APIs to access weather data
- Added segment classifier that breaks the extended route in segments that are in the same direction.
- Set up interactive map that highlights sections of intrest
- Added segments of intrest section
