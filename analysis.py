def show_summary(summary):
    total, avg_pain, avg_study, breaks, minutes = summary
    print("\n--- TRACKING SUMMARY ---")
    print("Days recorded:", total)
    if total == 0:
        print("No records available yet.")
    else:
        print("Average pain rating: {:.2f}/10".format(avg_pain))
        print("Average study hours: {:.2f}".format(avg_study))
        print("Total walking breaks:", breaks or 0)
        print("Total walking minutes:", minutes or 0)
    print("These summaries are not medical conclusions.")
