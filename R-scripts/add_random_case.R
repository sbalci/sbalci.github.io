
case_list <-
  jsonlite::fromJSON(txt = "https://www.patolojiatlasi.com/search.json",
                     simplifyDataFrame = TRUE) %>%
  as.data.frame()



case_list <- case_list %>%
  dplyr::filter(grepl(pattern = "html", x = text))

case_list <- case_list %>%
  dplyr::filter(!grepl(pattern = "Appendix ", x = title))

case_list <- case_list %>%
  dplyr::filter(grepl(pattern = "^\\d", x = title))


random_case <- dplyr::sample_n(case_list, 1)


casetitle <-
  trimws(gsub(
    pattern = "\\d|.\\d",
    replacement = "",
    x = random_case$title
  ))

casetitle <- stringr::str_trim(casetitle)

casesection <-
  trimws(gsub(
    pattern = "\\d|.\\d",
    replacement = "",
    x = random_case$section
  ))

casesection <- stringr::str_trim(casesection)

caselink <- random_case$text

pattern <- "https://images.patolojiatlasi.com/\\s*(.*?)\\s*html"
result <- regmatches(caselink, regexec(pattern, caselink))

caselink <-
  paste0("https://images.patolojiatlasi.com/", result[[1]][2], "html")


random_case_string <- glue::glue(
  "---",
  "
<br>
<br>
<br>
",
"\n",
"\n",
"{casetitle}",
": ",
"{casesection}",
"\n",
"\n",
"<iframe src='{caselink}' style='height:400px;width:100%;' data-external='1'></iframe>",
"\n",
"\n",
"<https://www.patolojiatlasi.com/{random_case$href}>",
"\n",
"\n",
.sep = ""
)


readr::write_lines(x = random_case_string,
                   file = "./custom_2.html",)

