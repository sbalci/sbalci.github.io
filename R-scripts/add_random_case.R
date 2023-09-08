`%>%` <- magrittr:::`%>%`


case_list <-
  readLines(con = "https://www.patolojiatlasi.com/webpages.txt") %>% 
  as.data.frame()
  
case_list <- case_list %>% 
  dplyr::filter(!grepl(pattern = "\\{|\\}", x = . ))



  # jsonlite::fromJSON(txt = "https://www.patolojiatlasi.com/search.json",
  #                    simplifyDataFrame = TRUE) %>%



# case_list <- case_list %>%
#   dplyr::filter(grepl(pattern = "html", x = text))
# 
# case_list <- case_list %>%
#   dplyr::filter(!grepl(pattern = "Appendix ", x = title))
# 
# case_list <- case_list %>%
#   dplyr::filter(grepl(pattern = "^\\d", x = title))


random_case <- dplyr::sample_n(case_list, 1)


# casetitle <-
#   trimws(gsub(
#     pattern = "\\d|.\\d",
#     replacement = "",
#     x = random_case$title
#   ))

# casetitle <- stringr::str_trim(casetitle)

# casesection <-
#   trimws(gsub(
#     pattern = "\\d|.\\d",
#     replacement = "",
#     x = random_case$section
#   ))

# casesection <- stringr::str_trim(casesection)
# 
# caselink <- random_case$text
# 
# pattern <- "https://images.patolojiatlasi.com/\\s*(.*?)\\s*html"
# result <- regmatches(caselink, regexec(pattern, caselink))
# 
# caselink <-
#   paste0("https://images.patolojiatlasi.com/", result[[1]][2], "html")

caselink <- random_case %>% 
  dplyr::pull(".")

random_case_string <- glue::glue(
  "<hr>",
  "
<br>
<br>
<br>
",
# "{casetitle}",
# ": ",
# "{casesection}",
"<br>
<br>
<br>",
"<iframe src='{caselink}' style='width:200px;' data-external='1'></iframe>",
"<br>
<br>
<br>",
# "<a href = 'https://www.patolojiatlasi.com/{random_case$href}' target = '_blank'>https://www.patolojiatlasi.com/{random_case$href}</a>",
"<br>
<br>
<br>",
as.character(Sys.Date()),
"<br>
<br>
<br>",
.sep = ""
)


readr::write_lines(x = random_case_string,
                   file = "./_custom_2.html")
  
random_case_string <- readLines(con = "./_custom_2.html")


custom_1_html <- readLines(con = "./_custom_1.html")


# custom_html <- c(custom_1_html, random_case_string)


readr::write_lines(
  # x = custom_html,
  x = custom_1_html,
  file = "./_custom.html"
  )

